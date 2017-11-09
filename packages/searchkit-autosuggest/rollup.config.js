import path from "path"
import postCss from "rollup-plugin-postcss"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import json from "rollup-plugin-json"
import babel from "rollup-plugin-babel"
import uglify from "rollup-plugin-uglify"
import license from "rollup-plugin-license"

let pkg = require("./package.json")

export default {
    name:"SearchkitAutosuggest",
    input:pkg.module,    
    output:{        
        file:pkg.main,
        format:'umd'
    },
    external:[
        'searchkit',
        'react'
    ],
    globals:{
        "react":"React",
        "searchkit":"Searchkit"
    },

    plugins:[
        postCss(),   
        commonjs(),         
        resolve({
            main:true,
            jsnext:true
        }),
        json(),
        babel({
            runtimeHelpers: true,
            exclude: 'node_modules/**',
        }),
        uglify(),
        license({
            banner:{
                file:path.join(__dirname, "BANNER")
            }
        })
    ]

}