const Pet = require('../models/Pet');

exports.createPet = async (req, res) => {
  try {
    const { name, specie, breed, age, gender } = req.body;
    const userId = req.user._id; // Assuming you have authentication middleware setting req.user

    // Create a new pet associated with the current user
    const newPet = new Pet({ name, specie, breed, age, gender, user: userId });
    await newPet.save();

    res.status(201).json({ message: 'Pet created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find({ user: req.user._id }); // Assuming you have authentication middleware setting req.user
    res.status(200).json(pets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getOnePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const pet = await Pet.findById(petId);

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if the pet belongs to the current user (assuming you have authentication middleware setting req.user)
    if (pet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. This pet does not belong to the current user' });
    }

    res.status(200).json(pet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const deletedPet = await Pet.findByIdAndDelete(petId);

    if (!deletedPet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if the pet belongs to the current user (assuming you have authentication middleware setting req.user)
    if (deletedPet.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. This pet does not belong to the current user' });
    }

    res.status(200).json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
