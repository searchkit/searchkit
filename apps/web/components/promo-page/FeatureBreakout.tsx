export const FeatureBreakout = ({ title, description, linkTitle, linkHref, image, subtext }: any) => {
  return (
    <div className="py-6 mx-auto container sm:mt-8 relative">
      <div className="grid grid-cols-12 gap-4">
        <div className="lg:col-span-8 col-span-12 lg:pt-0 pt-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl tracking-tight font-extrabold text-gray-200 sm:text-3xl lg:text-3xl xl:text-2xl">{title}</h2>
            <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">{description}</p>
            {subtext && <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">{subtext}</p>}
            {linkHref && <div className="mt-5 mx-auto sm:flex md:justify-left md:mt-8">
              <div className="rounded-md shadow">
                <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-gray-200 bg-gray-800 hover:bg-gray-200 focus:outline-none focus:border-gray-500 focus:shadow-outline-white transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10" href={linkHref}>{linkTitle}</a>
              </div>
            </div>
}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 overflow-hidden flex text-sm">
          {image}
        </div>
      </div>
    </div>
  )
}