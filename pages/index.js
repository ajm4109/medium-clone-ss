import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'

export default function Home({posts}) {
  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Medium Clone</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Header/>
      <section className='flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:p-0'>
        <div className='p-10 space-y-5'>
          <h1 className='text-6xl max-w-xl font-serif'>
            <span className='underline decoration-black decoration-4'>Medium</span> is a place to write, read and connect
          </h1>
          <h2>
            Its' easy and free to post your thinking on any topic and connect with millions of readers.
          </h2>
        </div>
        <div className='hidden md:inline-flex w-32 lg:w-96'>
          <Image src='/med_logo2.png' height={500} width={500} className='object-contain' />
        </div>
      </section>
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 p-2 lg:p-6'>
        {posts.map((post) => (
          
            <Link key={post._id} href={`/post/${post.slug.current}`}>
              <div className='group cursor-pointer border rounded-lg shadow-xl overflow-hidden'>
                  <img src={urlFor(post.mainImage).url()} className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out' />
                <div className='flex justify-between p-5 bg-zinc-200'>
                  <div>
                    <h1 className='text-xl font-bold'>{post.title}</h1>
                    <p>Written by {post.author.name}</p>
                  </div>
                    <img className='h-12 w-12 rounded-full' src={urlFor(post.author.image).url()} />
                </div>
              </div>
            </Link>
          
        ))}
      </section>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query =`*[_type == 'post']{
    _id,
    slug,
    title,
    author->{
    name,
    image,
  },
    mainImage,
    publishedAt,
  }`;

  const posts = await sanityClient.fetch(query)

  return {
    props:{
      posts,
    }
  };
}