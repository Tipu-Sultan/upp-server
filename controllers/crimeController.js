const Crime = require('../models/CrimeModel');
const CrimeNumberDetails = require('../models/CrimeNumberDetails');
const { generateCrimeReportPDF } = require('../services/PdfService');
const { sendCrimeDetailsEmail } = require('../services/sendMail');

const generateCrimeNumber = (firstName, lastName) => {
    return `UPPCR-${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}${Math.floor(Math.random() * 1000000)}`;
};

exports.registerCrime = async (req, res) => {
    const {
        crimeNumber,
        aadharNumber,
        email,
        crimeType,
        firstName,
        middleName,
        lastName,
        district,
        tehsil,
        policeStation,
        description,
        crimeDate,
        isFirstTimeOffender,
    } = req.body;
    const crimeData = req.body;
    try {
        // Validate required fields
        if (!aadharNumber || !crimeType || !firstName || !lastName || !district || !crimeDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if the person is already recorded in CrimeNumberDetails
        const existingPerson = await CrimeNumberDetails.findOne({ aadharNumber });

        let assignedCrimeNumber = crimeNumber;

        // If first-time offender and not in CrimeNumberDetails, generate a new crime number
        if (isFirstTimeOffender && !existingPerson) {
            assignedCrimeNumber = generateCrimeNumber(firstName, lastName);

            // Save details to CrimeNumberDetails for the first-time offender
            await CrimeNumberDetails.create({
                crimeNumber: assignedCrimeNumber,
                aadharNumber,
                email,
                firstName,
                lastName,
                isFirstTimeOffender: true,
                registeredBy: req.user.id,
            });
        }
        // If a repeat offender, check and use the existing crime number
        else if (!isFirstTimeOffender && existingPerson) {
            assignedCrimeNumber = existingPerson.crimeNumber;
        }
        // Handle any inconsistency if `isFirstTimeOffender` flag doesn't match data
        else if (isFirstTimeOffender && existingPerson) {
            return res.status(409).json({ error: 'Aadhaar number already exists as a registered offender.' });
        }

        // Save crime details in the Crime schema
        const newCrime = await Crime.create({
            aadharNumber,
            email,
            crimeNumber: assignedCrimeNumber,
            crimeType,
            firstName,
            middleName,
            lastName,
            district,
            tehsil,
            policeStation: policeStation || req.user.policeStation,
            description,
            crimeDate,
            registeredBy: req.user.id,
            crimeStatus: 'pending',
            isFirstTimeOffender: !existingPerson,
        });
        const crimeDetails = {
            assignedCrimeNumber,
            aadharNumber,
            email,
            crimeType,
            firstName,
            lastName,
            policeStation,
            description,
            crimeDate,
        };

        // if (newCrime) {
        //     await sendCrimeDetailsEmail(crimeDetails);
        // }

        const outputFilePath = `./pdfs/Crime_Report_${Date.now()}_${crimeData.crimeNumber}.pdf`;

        // Generate PDF
        generateCrimeReportPDF(crimeData, outputFilePath);
        res.status(201).json({ newCrime, message: 'Crime register successfully. Email send to you',pdfPath: outputFilePath.replace('./', '/') });
    } catch (error) {
        // Log the error for debugging
        console.error('Error registering crime:', error);
        res.status(500).json({ error: 'Failed to register crime' });
    }
};


exports.getCrimeRecords = async (req, res) => {
    const { crimeNumber } = req.params;

    try {
        const crimeRecords = await Crime.find({ crimeNumber })
            .populate('registeredBy', 'firstName lastName');

        // Check if any records were found
        if (crimeRecords.length === 0) {
            return res.status(404).json({ error: 'No records found :' + crimeNumber });
        }

        res.status(200).json(crimeRecords); // Return the array of crime records
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve crime records' });
    }
};

exports.getFilteredCrimeRecords = async (req, res) => {
    const { district, tehsil, policeStation } = req.query;

    try {
        // Return no result if all filters are empty
        if (!district && !tehsil && !policeStation) {
            return res.status(400).json({ error: 'At least one filter (district, tehsil, or police station) must be provided' });
        }

        // Initialize an empty filter object
        const filter = {};

        // Apply filters only when the parameters are provided
        if (district) {
            filter.district = { $regex: new RegExp(district, 'i') }; // Case-insensitive regex
        }
        if (tehsil) {
            // Apply tehsil filter only if district is also provided
            if (!district) {
                return res.status(400).json({ error: 'Tehsil filter requires a district to be selected' });
            }
            filter.tehsil = { $regex: new RegExp(tehsil, 'i') };
        }
        if (policeStation) {
            // Apply police station filter only if both district and tehsil are provided
            if (!district || !tehsil) {
                return res.status(400).json({ error: 'Police station filter requires both district and tehsil to be selected' });
            }
            filter.policeStation = { $regex: new RegExp(policeStation, 'i') };
        }

        // Fetch crime records with the provided filters
        const crimeRecords = await Crime.find(filter)
            .populate('registeredBy', 'firstName lastName');

        // If no records are found, return a 404
        if (crimeRecords.length === 0) {
            return res.status(404).json({ error: 'No records found' });
        }

        // Return the filtered crime records
        res.status(200).json(crimeRecords);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve crime records' });
    }
};

exports.updateCrimeRecord = async (req, res) => {
    const { crimeId } = req.params;
    const {
        email,
        firstName,
        middleName,
        lastName,
        crimeType,
        crimeDate,
        district,
        tehsil,
        policeStation,
        description,
    } = req.body; // Destructure the request body

    try {
        // Validate the input data
        // You can add more validation logic as needed
        if (!crimeId) {
            return res.status(400).json({ message: 'Crime ID is required.' });
        }

        // Find the crime record by ID and update it
        const updatedCrime = await Crime.findByIdAndUpdate(
            crimeId,
            {
                email,
                firstName,
                middleName,
                lastName,
                crimeType,
                crimeDate,
                district,
                tehsil,
                policeStation,
                description,
            },
            { new: true } // This option returns the updated document
        );

        // If no crime record was found, return an error
        if (!updatedCrime) {
            return res.status(404).json({ message: 'Crime record not found.' });
        }

        // Return the updated crime record
        res.status(200).json({
            message: 'Crime record updated successfully.',
            crime: updatedCrime,
        });
    } catch (error) {
        console.error(error); // Log error for debugging
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};

exports.updateCrimeStatus = async (req, res) => {
    const { crimeId } = req.params; // Get the crime ID from the request parameters
    const { crimeStatus } = req.body; // Get the new crime status from the request body

    try {
        // Find the crime record by ID and update the crimeStatus
        const updatedCrime = await Crime.findByIdAndUpdate(
            crimeId,
            { crimeStatus }, // Update only the crimeStatus
            { new: true, runValidators: true } // Return the updated document and run validation
        );

        if (!updatedCrime) {
            return res.status(404).json({ message: 'Crime record not found.' });
        }

        // Return the updated crime record
        return res.status(200).json({ message: 'Crime status updated successfully.', updatedCrime });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating crime status.', error: error.message });
    }
};

exports.deleteCrime = async (req, res) => {
    const { crimeId } = req.params; // Get the crime ID from the request parameters

    try {
        // Find the crime record by ID and delete it
        const deletedCrime = await Crime.findByIdAndDelete(crimeId);

        if (!deletedCrime) {
            return res.status(404).json({ message: 'Crime record not found.' });
        }

        // Return a success message
        return res.status(200).json({crimeId:crimeId, message: 'Crime record deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting crime record.', error: error.message });
    }
};









