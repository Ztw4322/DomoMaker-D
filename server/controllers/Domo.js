const models = require('../models');

const { Domo } = models;

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both Name and Age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo Already Exists!' });
    }
    return res.status(500).json({ error: 'An Error occured making domo!' });
  }
};

const makerPage = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age').lean().exec();

    return res.render('app', { domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An Error retrieving domo!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
};
