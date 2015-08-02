# yaml-translate


# Installation

```
npm install yaml-translate
```

# Usage

Create `language.yml` file in the root directory of your project and create key-value pair objects with the following syntax:

``` 
# Name
name:
 en: Name
 ru: Имя

# Description
description:
 en: Description
 ru: Описание
 de: Beschreibung
```

In your Node.js project require the `yaml-translate` module.

```js
var yaml = require('yaml-translate');
var options = {
    // optional options settings
    // see all available options below
};
translate.translate(options); 
```

Or if you are using Gulp, in your `gulpfile.js` place the following code:

```js
var yaml = require('yaml-translate');

gulp.task('translate', function() {
	var options = {
    	// optional options settings
        // see all available options below
    };
    return yaml.translate(options);   
});
```

And in terminal run the following command:

```
gulp translate
```

# Options

| Option    | Description | Default Value  |  Type  |
|-----------|-------------|----------------|---|
| src       | Language source file YAML | ./language.yml | String |
| outputDir | Output directory of generated JSON files |locale | String |
| only      | Array of only translatable language keys | '' | String or Array |
| except    | Array of language keys, which should be excluded | '' |  String or Array |
| clean     | Remove all generated files before regenerating | false | Boolean