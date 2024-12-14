import { HTTP_BAD_REQUEST, HTTP_UNAUTHORIZED } from "../constants/http_status";
import { PostModel } from "../models/post.model";

export default async (req: any, res: any, next: any) => {
  const id = req.params.id;
  if (!id) {
    return res.status(HTTP_BAD_REQUEST).send("Invalid post id!");
  }

  const userId = req.user.id;
  const post = await PostModel.findById(req.params.id);

  if (userId === post?.user.toString()) {
    return next();
  } else {
    return res
      .status(HTTP_UNAUTHORIZED)
      .send("You are not the owner of this post!");
  }
};
