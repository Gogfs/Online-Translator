import { useState, useEffect } from 'react'

const languages = [
  { code: 'en', name: 'English', },
  { code: 'es', name: 'Spanish', },
  { code: 'fr', name: 'French', },
  { code: 'de', name: 'German', },
  { code: 'it', name: 'Italian', },
  { code: 'pt', name: 'Portuguese', },

]

function App() {
  const [sourceLang, setSourceLang] = useState('en')
  const [targetLang, setTargetLang] = useState('pt')
  const [sourceText, setsourceText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [translatedText, setTranslatedText] = useState('')
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(true)


  // The useEffect is called every time that the source text, the target lang and the source lang is changed.
  useEffect(() => {
    if (sourceText) {
      const delay = setTimeout(() => {
        handleTranslate()
      }, 500)

      return () => clearTimeout(delay)
    }
  }, [sourceText, targetLang, sourceLang])


  // Translate function.
  const handleTranslate = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${sourceText}&langpair=${sourceLang}|${targetLang}`)

      if (!response.ok) {
        throw new Error(`HTPP ERROR: ${response.status}`)
      }

      const data = await response.json()

      setTranslatedText(data.responseData.translatedText)
    } catch (err) {
      setError(`Erro ao tentar traduzir: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Function that swap the languages
  const swapLanguage = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setsourceText(translatedText)
    setTranslatedText(sourceText)
  }

  // Function that validates changing of the language.
  const changeLangSource = (event) => {
    if (event.target.value === targetLang) {
      swapLanguage()
    }
    else {
      setSourceLang(event.target.value)
    }
  }

  // Function that validates changing of the language.
  const changeLangTarget = (event) => {
    if (event.target.value === sourceLang) {
      swapLanguage()
    }
    else {
      setTargetLang(event.target.value)
    }
  }

  // Function that toggle the dark mode.
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)

    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
    else {
      document.documentElement.classList.remove('dark');
    }
  }

  return (
    <>
      <div className='min-h-screen bg-background dark:bg-slate-700 flex-col'>
        <header className='bg-white dark:bg-slate-900 shadow-sm content-evenly'>
          <div className='max-w-5xl mx-auto px-4 py-3 flex justify-around items-center '>
            <h1 className='text-headerColor dark:text-white text-2xl font-semibold'>Translator</h1>
            <button className='bg-slate-800 dark:bg-yellow-500 p-2 rounded-md text-white' onClick={toggleDarkMode}>{darkMode ? (<p>Dark mode</p>) : (<p>Light mode</p>)}</button>
          </div>
        </header>

        <main className='flex-grow flex items-start justify-center px-4 py-8'>
          <div className='w-full max-w-5xl bg-white dark:bg-slate-800 rounded-lg shadow-mm overflow-hidde'>
            <div className='flex items-center justify-between p-4 border-b border-gray-200'>
              <select value={sourceLang} onChange={changeLangSource} className='text-sm text-textColor dark:text-white dark:bg-slate-800 bg-transparent border-none focus:outline-none cursor-pointer'>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>

              <button className='p-2 rounded-full hover:bg-gray-100 outline-none' onClick={swapLanguage}>
                <svg
                  className="w-5 h-5 text-headerColor"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>

              <select value={targetLang} onChange={changeLangTarget} className='text-sm text-textColor dark:text-white dark:bg-slate-800 bg-transparent border-none focus:outline-none cursor-pointer'>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>

            </div>

            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='p-4'>
                <textarea value={sourceText} onChange={event => setsourceText(event.target.value)} placeholder='Write your text...' className='w-full h-40 text-lg text-text-Color dark:text-white bg-transparent resize-none border-none outline-none'>

                </textarea>
              </div>


              <div className='p-4 relative bg-secondaryBackground dark:bg-slate-600 border-l border-gray-200'>
                {isLoading ? (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500'></div>
                  </div>) :
                  (<p className='text-lg text-textColor dark:text-white'>{translatedText}</p>)
                }
              </div>
            </div>


            {error && (
              <div className='p-4 bg-red-100 border-t border-red-400 text-red-700'>
                {error}
              </div>
            )}

          </div>
        </main>


        <footer className='absolute inset-x-0 bottom-0 bg-white dark:bg-slate-900 border-t border-gray-200 mt-auto'>
          <div className='max-w-5xl mx-auto px-4 py-3 text-sm text-headerColor dark:text-white text-semibold'>
            &copy; {new Date().getFullYear()} Online Translator
          </div>
        </footer>

      </div>
    </>
  )
}

export default App
