const { default: axios } = require('axios');
const CAPTCHA_URL = 'https://www.google.com/recaptcha/api/siteverify';
const COLLECTION_NAME = 'submissions';
const { CAPTCHA_SECRET } = require('./secrets.js');

module.exports = function (db) {
  this.db = db;
  this.getItem = async (req, res) => {
    const doc = await this.db
      .collection(COLLECTION_NAME)
      .doc(req.params.id)
      .get();
    return res.send(doc.data());
  };

  this.createItem = async (req, res) => {
    const { captchaToken, email } = req.body;
    const { action } = req.params;

    const response = await axios.post(
      CAPTCHA_URL,
      new URLSearchParams({
        secret: CAPTCHA_SECRET,
        response: captchaToken,
      })
    );
    if (!response.data.success) {
      return res.send(403);
    }
    try {
      let docRef = await this.db
        .collection(COLLECTION_NAME)
        .doc()
        .set({ action: action, email: email });
      const doc = await docRef.get();
      return res.send({ success: true });
    } catch (error) {
      return res.send(error);
    }
  };

  this.getItems = async (req, res) => {
    const snapshot = await this.db.collection(COLLECTION_NAME).get();
    let results = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    return res.send(results);
  };

  this.updateItem = async (req, res) => {
    const docRef = this.db.collection(COLLECTION_NAME).doc(req.params.id);
    await docRef.set({
      name: req.body.name,
    });
    const doc = await docRef.get();
    return res.send(doc.data());
  };

  this.deleteItem = async (req, res) => {
    const response = await db
      .collection(COLLECTION_NAME)
      .doc(req.params.id)
      .delete();
    return res.send(response);
  };
};
