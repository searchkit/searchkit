import Image from 'next/image'

export const FeatureBreakout = ({ title, description, linkTitle, linkHref, image, subtext, snippets }: any) => {
  return (
    <div className="py-6 mx-auto container sm:mt-8 relative">
      <div className="grid grid-cols-12 gap-4">
        <div className="lg:col-span-8 col-span-12 lg:pt-0 pt-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl tracking-tight font-extrabold text-gray-200 sm:text-3xl lg:text-3xl xl:text-2xl">{title}</h2>
            <p className="mt-2 text-base text-gray-300 sm:mt-2 sm:text-xl lg:text-lg xl:text-xl">{description}</p>
            {subtext && <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">{subtext}</p>}
            {linkHref && <div className="">
              <a className="text-indigo-500 text-center block sm:text-left md:py-3 md:text-md" href={linkHref}>Read More &rarr;</a>
            </div>
}
          </div>
        </div>
        {
          snippets && (
            snippets.map((snippet: any, index: number) => (
              <div key={index} className="md:col-span-6 col-span-12 pt-6 sm:max-w-xs">
                <div className="text-center sm:text-left mb-3">
                  <h2 className="text-xl tracking-tight font-extrabold text-gray-200 sm:text-xl lg:text-xl xl:text-xl">{snippet.title}</h2>
                  <p className="mt-3 text-base text-gray-300 sm:mt-2 sm:text-lg lg:text-md xl:text-lg">{snippet.description}</p>
                </div>
                {snippet.link && <a href={snippet.link} className="text-indigo-500 text-center block sm:text-left">Read More &rarr;</a>}
              </div>
        )))}
      </div>
    </div>
  )
}