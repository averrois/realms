import Link from 'next/link'

export default async function Index() {

  return (
    <div className='w-full h-screen grid place-items-center'>
        <div className='flex flex-col items-center'>
            <h1>Welcome to Realms</h1>
            <Link href='/app'>Open App</Link>
        </div>
    </div>
  )
}
