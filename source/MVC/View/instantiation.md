# MVC | View Instantiation

- [View With Element, Attributes, Templates, Insert Properties](#view-with-element-attributes-templates-insert-properties)
- [View With UI, UI Events, and UI Callbacks](#view-with-ui-ui-events-and-ui-callbacks)

## View With Element, Attributes, Templates, Insert Properties
**Configuration**  
```
let data = { title: 'Button' }
let view = new MVC.View({
  elementName: 'nav',
  attributes: {
    'class': 'navigation',
  },
  templates: {
    template: (data) => { return `\n\t<button>${data.title}</button>\n` },
  },
  insert: {
    view: document.querySelector('body'),
    method: 'afterbegin',
  },
  render: function (data) {
    let template = this.templates.template(data);
    this.element.innerHTML = template
    return this
  },
}).enable()
  .render(data)
  .autoInsert()
```

**Results**  
```
<nav class="navigation">
	<button>Button</button>
</nav>
```

## View With UI, UI Events, and UI Callbacks
**Configuration**  
```
let data = [
  {
    title: 'Button A'
  },
  {
    title: 'Button B'
  },
  {
    title: 'Button C'
  },
  {
    title: 'Button D'
  }
]
let view = new MVC.View({
  elementName: 'nav',
  attributes: {
    'class': 'navigation',
  },
  templates: {
    template: (data) => {
      return `
      ${
        data.map((button) => {
          return [`<button>`, button.title, `</button>`].join('')
        }).join('\n')
      }
      `
    },
  },
  ui: {
    'button': 'button',
  },
  uiEvents: {
    '[button] click': '[button]',
  },
  uiCallbacks: {
    'button': function button(event) {
      console.log(
        '-----',
        '\n',
        'click event',
        '\n',
        '-----',
        '\n',
        event.currentTarget
      )
    },
  },
  insert: {
    view: document.querySelector('body'),
    method: 'afterbegin',
  },
  render: function (data) {
    let template = this.templates.template(data);
    this.element.innerHTML = template
    return this
  },
}).enable()
  .render(data)
  .autoInsert()


let delay = 1000
for(var i = 0; i < data.length; i++) {
  let index = i
  setTimeout(() => {
    view.ui.button.item(index).dispatchEvent(new MouseEvent('click'))
  }, delay * i)
}
```

**Results**  
```
<nav class="navigation">
  <button>Button A</button>
  <button>Button B</button>
  <button>Button C</button>
  <button>Button D</button>
</nav>
```

```
-----
click event
<button>​Button A​</button>​

-----
click event
<button>​Button B</button>​

-----
click event
<button>​Button C​</button>​

-----
click event
<button>​Button D​</button>​
```
