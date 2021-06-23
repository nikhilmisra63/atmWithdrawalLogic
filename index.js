const Joi = require('joi');
const _ = require('lodash');
const noteValidator = Joi.object().keys({
  note: Joi.number().required()
});

const services = Joi.array().items(noteValidator);
const validateNotes = async (notes) => {
  return services.validateAsync(notes);
};

const defaultNotes = [{ note: 100 }, { note: 500 }, { note: 200 }, { note: 100 }, { note: 50 }, { note: 10 }];

module.exports = {
  atm: async (options) => {
    if (!options) return new Error('Not a Valid Call');

    const { denomination } = options;
    let { withdrawalAmount, supportedNotes } = options;
    if (supportedNotes && (!_.isArray(supportedNotes) || _.isEmpty(supportedNotes))) {
      return new Error('Invalid Supported Notes');
    }

    if (supportedNotes) {
      try {
        supportedNotes = await validateNotes(supportedNotes);
      } catch (error) {
        return error;
      }
    }

    let notes = supportedNotes || defaultNotes;
    notes = _.orderBy(notes, 'note', 'desc');

    for (let i = 0; i < notes.length; i += 1) {
      if (denomination && notes[i].note > denomination) {
        notes[i].count = 0;
        continue;
      }
      notes[i].count = Math.floor(withdrawalAmount / notes[i].note);
      withdrawalAmount %= notes[i].note;
    }
    return notes;
  }
};
