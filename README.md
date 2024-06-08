## React Tailwind Modal Component

This is a Modal component converted from jquery to React.  
Original component may be found [here](https://github.com/kylefox/jquery-modal).

Please note that this modal requires tailwind to work properly.  
In order to use it, please [install](https://tailwindcss.com/docs/installation) tailwind.  
Once installed, update your `tailwind.config.js` like so:

```javascript
export default {
  ...,
  content: [
    ...,
    './node_modules/ribeyrollesmatthieu_modal/**/*.{js,ts,jsx,tsx}',
  ],
  ...
};
```

Once this is done, you're free to go !

## Props

| Prop     | Type       | Default Value    | Required ? | Description                         |
| -------- | ---------- | ---------------- | ---------- | ----------------------------------- |
| options  | Options    | options defaults | true       | Modal options (cf below)            |
| isOpened | boolean    | -                | true       | Current modal state                 |
| onOpen   | () => void | -                | false      | Event to trigger on modal opening   |
| onClose  | () => void | -                | false      | Event to trigger on modal closing   |
| children | ReactNode  | -                | false      | Content to display inside the modal |
| title    | string     | -                | false      | Title of the modal                  |

## Options props

| Prop         | Type    | Default Value      | Required ? | Description                                                      |
| ------------ | ------- | ------------------ | ---------- | ---------------------------------------------------------------- |
| fadeDuration | string  | ' '                | true       | Duration for the fade animation (in seconds)                     |
| fadeDelay    | number  | 1.0                | true       | Delay before the fade animation (in seconds)                     |
| escapeClose  | boolean | true               | false      | Trigger closing on escape key pressed                            |
| clickClose   | boolean | true               | false      | Trigger closing when clicking outside the modal (on the blocker) |
| showClose    | boolean | true               | false      | Display the close icon                                           |
| closeClass   | string  | ' '                | false      | Classes for the close icon                                       |
| modalClass   | string  | 'modal'            | false      | Classes for the modal                                            |
| blockerClass | string  | 'modal\_\_blocker' | false      | Classes for the blocker                                          |
