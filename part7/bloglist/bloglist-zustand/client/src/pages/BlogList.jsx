import { Link } from "react-router-dom";
import { useBlogs } from "../stores/blogStore";

const BlogList = () => {
  const blogs = useBlogs();

  return (
    <div>
      <h2>blogs</h2>
      <ul data-testid="bloglist">
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link
              to={`/blogs/${blog.id}`}
            >{`${blog.title} by ${blog.author}`}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;
