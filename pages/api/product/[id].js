import connectDB from "../../../utils/connectDB";
import Products from "../../../models/productModel";
import auth from "../../../middleware/auth";

connectDB();

export default async (req, res) => {
  switch (req.method) {
    case "GET":
      await getProduct(req, res);
      break;
    case "PUT":
      await updateProduct(req, res);
      break;
    case "DELETE":
      await deleteProduct(req, res);
      break;
  }
};

//product 내보내기
const getProduct = async (req, res) => {
  try {
    const { id } = req.query;

    const product = await Products.findById(id);
    if (!product)
      return res.status(400).json({ err: "This product does not exist." });

    res.json({ product });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

//업데이트된 product 내보내기
const updateProduct = async (req, res) => {
  try {
    const result = await auth(req, res);
    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;
    const { title, price, inStock, description, content, category, images } =
      req.body;

    if (
      !title ||
      !price ||
      !inStock ||
      !description ||
      !content ||
      category === "all" ||
      images.length === 0
    )
      return res.status(400).json({ err: "Please add all the fields." });

    await Products.findOneAndUpdate(
      { _id: id },
      {
        title: title.toLowerCase(),
        price,
        inStock,
        description,
        content,
        category,
        images,
      }
    );

    res.json({ msg: "Update Success!" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};

//product 삭제뒤 내보내기
const deleteProduct = async (req, res) => {
  try {
    const result = await auth(req, res);

    if (result.role !== "admin")
      return res.status(400).json({ err: "Authentication is not valid." });

    const { id } = req.query;

    await Products.findByIdAndDelete(id);

    res.json({ msg: "Delete Success!" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
};
