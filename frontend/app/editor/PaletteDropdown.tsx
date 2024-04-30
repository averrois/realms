import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type PaletteDropdownProps = {
    menuItems: any[]
    selectedItem: any
    setSelectedItem: (item: any) => void
}

const PaletteDropdown:React.FC<PaletteDropdownProps> = ({ menuItems, selectedItem, setSelectedItem }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-56 justify-between bg-secondaryhoverdark px-3 text-sm font-semibold text-white shadow-sm capitalize">
          {selectedItem}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-white" aria-hidden="true" />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 w-56 origin-top-right bg-secondary shadow-lg focus:outline-none">
          <div>
            {menuItems.map((item) => (
                <Menu.Item>
                    {({ active }) => (
                        <div
                            className={classNames(
                                active ? 'bg-secondaryhoverdark' : '',
                                'block px-4 text-sm capitalize cursor-pointer text-white'
                            )}
                            onClick={() => setSelectedItem(item)}
                        >
                            {item}
                        </div>
                    )}
                </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default PaletteDropdown