import { Link, useParams } from "react-router-dom";
import Image from "../components/Image";
import Search from "../components/Search";
import Comments from "../components/Comments";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
};

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isLoading, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug),
  });

  if (isLoading) return "Loading...";
  if (error) return `Something went wrong! ${error.message}`;
  if (!data) return "Post not found!";

  // Safely access properties and provide fallbacks
  const title = data.title || "Untitled Post";
  const category = data.category || "Uncategorized";
  const createdAt = data.createdAt || new Date();
  const description = data.desc || "No description available.";
  const user = data.user || {};
  const username = user.username || "Unknown Author";
  const userImg = user.img;
  const postImg = data.img;

  return (
    <div className="flex flex-col gap-8">
      {/* detail */}
      <div className="flex gap-8">
        <div className="lg:w-3/5 flex flex-col gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link className="text-blue-800">{username}</Link>
            <span>on</span>
            <Link className="text-blue-800">{category}</Link>
            <span>{format(createdAt)}</span>
          </div>
          <p className="text-gray-500 font-medium">{description}</p>
        </div>
        {postImg && (
          <div className="hidden lg:block w-2/5">
            <Image src={postImg} w="600" className="rounded-2xl" />
          </div>
        )}
      </div>
      {/* content */}
      <div className="flex flex-col md:flex-row gap-12 justify-between">
        {/* text */}
        <div className="lg:text-lg flex flex-col gap-6 text-justify">
          {/* Replace the placeholder content with dynamic content if available */}
          <p>{description}</p>
        </div>
        {/* menu */}
        <div className="px-4 h-max sticky top-8">
          <h1 className="mb-4 text-sm font-medium">Author</h1>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-8">
              {userImg && (
                <Image
                  src={userImg}
                  className="w-12 h-12 rounded-full object-cover"
                  w="48"
                  h="48"
                />
              )}
              <Link className="text-blue-800">{username}</Link>
            </div>
            <p className="text-sm text-gray-500">
              Bio or additional info about the author can go here.
            </p>
            <div className="flex gap-2">
              <Link>
                <Image src="facebook.svg" />
              </Link>
              <Link>
                <Image src="instagram.svg" />
              </Link>
            </div>
          </div>
          {/* Placeholder for PostMenuActions */}
          <h1 className="mt-8 mb-4 text-sm font-medium">Categories</h1>
          <div className="flex flex-col gap-2 text-sm">
            <Link className="underline">All</Link>
            <Link className="underline" to="/">
              Web Design
            </Link>
            <Link className="underline" to="/">
              Development
            </Link>
            <Link className="underline" to="/">
              Databases
            </Link>
            <Link className="underline" to="/">
              Search Engines
            </Link>
            <Link className="underline" to="/">
              Marketing
            </Link>
          </div>
          <h1 className="mt-8 mb-4 text-sm font-medium">Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={data._id} />
    </div>
  );
};

export default SinglePostPage;
