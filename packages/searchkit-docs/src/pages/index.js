import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import GithubLogo from './components/GithubLogo';
import './styles.css';

function Hero() {
  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="relative z-10 pb-8 bg-white sm:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
        <div className="relative pt-6 px-4 sm:px-6 lg:px-8">
          <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start">
            <a
              className="font-medium text-yellow-800 hover:text-gray-900 transition duration-150 ease-in-out"
              href="#">
              Searchkit
            </a>
            <div className="hidden md:block md:ml-10 md:pr-4 flex-row-reverse ">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-gray-900 transition duration-150 ease-in-out">
                Quickstart
              </a>
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-gray-900 transition duration-150 ease-in-out">
                Docs
              </a>
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-gray-900 transition duration-150 ease-in-out">
                <GithubLogo />
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <div className="relative bg-white overflow-hidden">
      <Hero />
    </div>
  );
}

export default Home;
