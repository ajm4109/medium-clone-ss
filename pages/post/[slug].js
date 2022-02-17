import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import PortableText from 'react-portable-text';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const Post = ({ post }) => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    fetch('/api/createComment', {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
        console.log(data);
      })
      .catch((err) => {
        setSubmitted(false);
        console.log(err);
      });
  };

  console.log(post);

  return (
    <main>
      <Header />
      <img
        src={urlFor(post.mainImage).url()}
        className=' w-full h-40 object-cover'
      />

      <article className='max-w-3xl mx-auto p-5'>
        <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
        <div className='flex items-center space-x-2'>
          <img
            src={urlFor(post.author.image).url()}
            className=' h-10 w-10 rounded-full'
          />
          <p className='font-extralight text-sm'>
            Blog post by {post.author.name} - Published at{' '}
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <PortableText
            className='p-10'
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: (props) => (
                <h1
                  className='text-2xl text-green-800 font-bold my-5'
                  {...props}
                />
              ),
              h2: (props) => (
                <h2
                  className='text-xl text-green-600 font-bold my-5'
                  {...props}
                />
              ),
              li: ({ children }) => (
                <li className='ml-4 list-disc text-black font-bold'>
                  {children}
                </li>
              ),
              link: ({ href, children }) => (
                <a href={href} className='text-blue-500 hover:underline'>
                  {children}
                </a>
              ),
              normal: ({ children }) => <p className='my-5'>{children}</p>,
            }}
          />
        </div>
      </article>
      <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />

      {submitted ? (
        <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
          <h3 className=' text-3xl font-bold'>
            Thank you for submitting a comment!
          </h3>
          <p>Once it is approved, it will appear below!</p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex flex-col mt-10 p-5 max-w-2xl mx-auto mb-10'>
          <h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
          <h4 className='text-3xl font-bold'>Leave a comment below!</h4>

          <input
            {...register('_id')}
            type='hidden'
            name='_id'
            value={post._id}
          />

          <label className='block mt-10 mb-5'>
            <span className='text-gray-700'>Name</span>
            <input
              {...register('name', { required: true })}
              className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring'
              placeholder='Enter Your Name'
              type='text'
            />
          </label>
          <label className='block mb-5'>
            <span className='text-gray-700'>Email</span>
            <input
              {...register('email', { required: true })}
              className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring'
              placeholder='Enter Your Email'
              type='email'
            />
          </label>
          <label className='block mb-5'>
            <span className='text-gray-700'>Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring'
              placeholder='Enter Your Comment'
              rows={8}
            />
          </label>

          <div className='flex flex-col p-5'>
            {errors.name && (
              <span className='text-red-500'>* The name field is required</span>
            )}
            {errors.email && (
              <span className='text-red-500'>
                * The email field is required
              </span>
            )}
            {errors.comment && (
              <span className='text-red-500'>
                * The comment field is required
              </span>
            )}
          </div>

          <input
            type='submit'
            className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold px-4 py-2 rounded cursor-pointer'
          />
        </form>
      )}

      <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow shadow-yellow-500 space-y-2'>
        <h3 className=' text-4xl'>Comments</h3>
        <hr className='pb-2' />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className=' text-yellow-500 font-bold'>
                {comment.name}:{' '}
              </span>
              {comment.comment}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type=='post']{
        _id,
        slug{
            current
        }
    }`;

  const posts = await sanityClient.fetch(query);

  const paths = posts.map((post) => ({
    params: {
      slug: post.slug.current,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps = async ({ params }) => {
  const query = `*[_type =='post' && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
            name,
            image
        },
        'comments': *[
          _type == 'comments' &&
          post._ref == ^._id &&
          approved == true],
        mainImage,
        slug,
        body
    }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};

// 'comments': *[_type == 'comment' &&
// post._ref == ^._id &&
// approved == true],
