import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
  Switch,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('HDialog', Dialog)
  nuxtApp.vueApp.component('HDialogPanel', DialogPanel)
  nuxtApp.vueApp.component('HDialogTitle', DialogTitle)
  nuxtApp.vueApp.component('HDisclosure', Disclosure)
  nuxtApp.vueApp.component('HDisclosureButton', DisclosureButton)
  nuxtApp.vueApp.component('HDisclosurePanel', DisclosurePanel)
  nuxtApp.vueApp.component('HMenu', Menu)
  nuxtApp.vueApp.component('HMenuButton', MenuButton)
  nuxtApp.vueApp.component('HMenuItem', MenuItem)
  nuxtApp.vueApp.component('HMenuItems', MenuItems)
  nuxtApp.vueApp.component('HPopover', Popover)
  nuxtApp.vueApp.component('HPopoverButton', PopoverButton)
  nuxtApp.vueApp.component('HPopoverPanel', PopoverPanel)
  nuxtApp.vueApp.component('HSwitch', Switch)
  nuxtApp.vueApp.component('HTab', Tab)
  nuxtApp.vueApp.component('HTabGroup', TabGroup)
  nuxtApp.vueApp.component('HTabList', TabList)
  nuxtApp.vueApp.component('HTabPanel', TabPanel)
  nuxtApp.vueApp.component('HTabPanels', TabPanels)
  nuxtApp.vueApp.component('HTransitionChild', TransitionChild)
  nuxtApp.vueApp.component('HTransitionRoot', TransitionRoot)
})
