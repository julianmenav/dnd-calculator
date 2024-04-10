
export default function GlobalLayout({ children }){
    return (
        <div className='h-screen w-screen bg-japanese-blue'>
            <nav className="w-full top-0 h-16 bg-clickferry flex justify-center">

            </nav>
            <content className='w-full flex flex-col items-center px-6 md:px-12 py-4'>
                {children}
            </content>
        </div>
    )
}