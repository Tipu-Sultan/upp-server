const Crime = require('../models/CrimeModel');

const generateCrimeNumber = (firstName, lastName) => {
    return `UPPCR-${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}${Math.floor(Math.random() * 1000000)}`;
};

exports.registerCrime = async (req, res) => {
    const {
        crimeNumber,
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

    try {
        // Validate required fields
        if (!crimeType || !firstName || !lastName || !district || !crimeDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Generate a new crime number only if this is the first offense
        const assignedCrimeNumber = isFirstTimeOffender ? generateCrimeNumber(firstName, lastName) : crimeNumber;

        const newCrime = await Crime.create({
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
            isFirstTimeOffender,
        });

        res.status(201).json(newCrime);
    } catch (error) {
        // Log the error for debugging
        console.error('Error registering crime:', error);

        // Handle different types of errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }

        // Check for duplicate crimes if applicable
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Crime number already exists' });
        }

        // Fallback for any other errors
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
            return res.status(404).json({ error: 'No records found :'+crimeNumber });
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









