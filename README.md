#jQuery UI CheckBox#

###Intro###
Customizable CheckBox control with custom icon and reaction on mouse hover event


###How to install###
1. Add to `bower.json` of your project:
```javascript
{
	// ...
	"dependencies": {
		// ...
		"jquery.ui-checkbox": "git://github.com/DenisIzmaylov/jquery.ui-checkbox.git"
	}
}
```

2. Run `bower install`.
3. To any place at your HTML (just for example!):
```html
<link href="path/to/plugin/css/jquery.ui-checkbox.css" rel="stylesheet" />
<script src="path/to/plugin/js/jquery.ui-checkbox.js"></script>
<script src="javascript">
	
	$(document).ready(function () {
		
		$('.ui-checkbox-control').UICheckBox({
			
			value: false
			
		}).on('change', function (value) {
			
			console.log('New value: ', value);
			
		});
	
	});
	
</script>
```
4. You can also look example in `example.html`.
