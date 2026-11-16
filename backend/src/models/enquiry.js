// A brief sent through the contact form.
module.exports = (sequelize, DataTypes) => {
  const Enquiry = sequelize.define(
    'Enquiry',
    {
      name: { type: DataTypes.STRING(120), allowNull: false },
      email: { type: DataTypes.STRING(254), allowNull: false },
      phone: { type: DataTypes.STRING(40), allowNull: false, defaultValue: '' },
      company: { type: DataTypes.STRING(160), allowNull: false, defaultValue: '' },
      services: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
      budget: { type: DataTypes.STRING(120), allowNull: false, defaultValue: '' },
      deadline: { type: DataTypes.STRING(120), allowNull: false, defaultValue: '' },
      brief: { type: DataTypes.TEXT, allowNull: false },
      referenceLinks: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
      isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { tableName: 'enquiries' }
  );

  Enquiry.associate = (models) => {
    Enquiry.hasMany(models.EnquiryFile, { as: 'files', foreignKey: 'enquiryId', onDelete: 'CASCADE' });
  };

  return Enquiry;
};
