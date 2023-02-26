

export const IntroButtons = () => {
  return (
    <div className="mt-5 pb-8 mx-auto sm:flex sm:justify-center lg:justify-start lg:mx-0 md:mt-8">
      <div className="rounded-md shadow">
        <a className="w-full flex items-center no-underline justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-500 focus:shadow-outline-white transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10" href="/docs/getting-started/with-react">Get Started</a>
      </div>
      <div className="rounded-md shadow mt-3 md:mt-0 md:ml-3"><a className="w-full flex items-center no-underline justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-gray-100  hover:bg-gray-900 focus:outline-none focus:border-gray-900 focus:shadow-outline-blue transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10 border-gray-900" href="/demo">View Demo</a></div>
    </div>
  )
}