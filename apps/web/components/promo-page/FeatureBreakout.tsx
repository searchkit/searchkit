import Image from 'next/image'

export const FeatureBreakout = ({ title, description, linkTitle, linkHref, image, subtext, snippets }: any) => {
  return (
    <div className="py-6 mx-auto container sm:mt-8 relative">
      <div className="grid grid-cols-12 gap-4">
        <div className="lg:col-span-8 col-span-12 lg:pt-0 pt-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl tracking-tight font-extrabold text-gray-200 sm:text-3xl lg:text-3xl xl:text-2xl">{title}</h2>
            <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">{description}</p>
            {subtext && <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">{subtext}</p>}
            {linkHref && <div className="mt-5 mx-auto sm:flex md:justify-left md:mt-8">
              <div className="rounded-md shadow">
                <a className="w-full flex items-center font-semibold justify-center px-6 py-2 border border-transparent text-base leading-6 rounded-md text-gray-200 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-500 focus:shadow-outline-white transition duration-150 ease-in-out md:py-3 md:text-md md:px-4" href={linkHref}>{linkTitle}</a>
              </div>
            </div>
}
          </div>
        </div>
        {
          snippets && (
            snippets.map((snippet: any, index: number) => (
              <div key={index} className="lg:col-span-12 col-span-12 pt-6 sm:max-w-xs">
                <div className="text-center sm:text-left mb-3">
                  <h2 className="text-xl tracking-tight font-extrabold text-gray-200 sm:text-xl lg:text-xl xl:text-xl">{snippet.title}</h2>
                  <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-lg lg:text-md xl:text-lg">{snippet.description}</p>
                </div>
                {snippet.link && <a href={snippet.link} className="text-indigo-500 pt-3 text-center block sm:text-left">Read More &rarr;</a>}
              </div>
        )))}
      </div>
    </div>
  )
}