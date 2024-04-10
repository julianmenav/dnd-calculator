
export default function GlobalLayout({ children }){
    return (
        <div className='min-h-screen w-full bg-japanese-blue'>
            <nav className="w-full top-0 h-16 bg-clickferry flex justify-start items-center px-10 text-white font-bold text-xl">
                DND CALCULATOR
            </nav>
            <content className='w-full flex flex-col items-center px-6 md:px-12 py-4'>
                {children}
            </content>
        </div>
    )
}