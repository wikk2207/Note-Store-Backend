const errorMessage = require('./errorMessages');

const checkRequiredField = (property, propertyName, res) => {
    if (!property) {
        res
            .status(400)
            .send(errorMessage.missingProperty(propertyName));
    }
    return Boolean(property);
 };

 module.exports = checkRequiredField;