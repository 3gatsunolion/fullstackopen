import { Link } from "react-router-dom";
import { useBlogs } from "./useBlogs";

const BlogList = () => {
  const { blogs, isPending, isError } = useBlogs();

  if (isPending) return <h2>Loading...</h2>;

  if (isError) throw Error("Could not get blogs.");

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
