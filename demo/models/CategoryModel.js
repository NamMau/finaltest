const mongoose = require('mongoose');
const CategorySchema = mongoose.Schema(
   {
      name: String
   }
);

const CategoryModel = mongoose.model("categories", CategorySchema);
module.exports = CategoryModel;
