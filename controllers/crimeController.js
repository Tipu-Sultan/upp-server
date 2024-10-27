const Crime = require('../models/CrimeModel');

const generateCrimeNumber = (firstName, lastName) => {
    return `UPCR-${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}${Math.floor(Math.random() * 1000000)}`;
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
        // Generate a new crime number only if this is the first offense
        const assignedCrimeNumber = isFirstTimeOffender ? generateCrimeNumber(firstName,lastName) : crimeNumber;

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
        res.status(500).json({ error: 'Failed to register crime' });
        console.log(error);
    }
};


exports.getCrimeRecords = async (req, res) => {
    const { crimeNumber } = req.params; 

    try {
        const crimeRecords = await Crime.find({ crimeNumber })
            .populate('registeredBy', 'firstName lastName'); 
    
        // Check if any records were found
        if (crimeRecords.length === 0) {
            return res.status(404).json({ error: 'No records found' });
        }

        res.status(200).json(crimeRecords); // Return the array of crime records
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve crime records' });
    }
};

exports.getFilteredCrimeRecords = async (req, res) => {
    const { district, tehsil, policeStation } = req.query;

    console.log(district,tehsil, policeStation)
    try {
        const filter = {};
        
        // Build filter object based on provided parameters
        if (district) {
            filter.district = { $regex: new RegExp(district, 'i') }; // Case-insensitive regex
        }
        if (tehsil) {
            filter.tehsil = { $regex: new RegExp(tehsil, 'i') }; // Case-insensitive regex
        }
        if (policeStation) {
            filter.policeStation = { $regex: new RegExp(policeStation, 'i') }; // Case-insensitive regex
        }

        // If policeStation is empty, we don't want to filter it out
        const crimeRecords = await Crime.find(filter)
            .populate('registeredBy', 'firstName lastName');

        if (crimeRecords.length === 0) {
            return res.status(404).json({ error: 'No records found' });
        }

        res.status(200).json(crimeRecords);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve crime records' });
    }
};








