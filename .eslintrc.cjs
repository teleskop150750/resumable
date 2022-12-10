/* eslint-disable max-len */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/all',
    'plugin:jsonc/recommended-with-jsonc',
    'plugin:yml/standard',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: [
    '*.min.*',
    // '*.d.ts',
    'CHANGELOG.md',
    'dist',
    'LICENSE*',
    'output',
    'coverage',
    'public',
    'temp',
    'packages-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    '__snapshots__',
    '!.github',
    '!.vitepress',
    '!.vscode',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: true,
      node: {
        node: { extensions: ['.js', '.cjs', '.mjs', '.jsx', '.ts', '.cts', '.mts', '.tsx', '.d.ts'] },
      },
    },
    // 'import/extensions': ['.js', '.mjs', '.jsx'],
    // 'import/core-modules': [],
    'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ['*.d.ts'],
      parser: '@typescript-eslint/parser',
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': 'warn',
      },
    },
    {
      files: ['*.ts', '*.tsx', '*.mts', '*.cts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      rules: {
        /**
         * Запрещает использование комментариев или
         * требует описаний после директивы (@ts-<directive>ban-ts-comment)
         */
        '@typescript-eslint/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
        // Требовать согласованного интервала вокруг аннотаций типов
        '@typescript-eslint/type-annotation-spacing': 'error',
        // Обеспечивает согласованное использование импорта типов
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports', disallowTypeAnnotations: false },
        ],
        // Согласуется с определением типа либо или interface type (consistent-type-definitions)
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        // Принудительное применение или запрет на использование типа записи Record<string, unknown>;
        '@typescript-eslint/consistent-indexed-object-style': ['error', 'record'],
        // Рекомендует использовать более @ts-expect-error@ts-ignore
        '@typescript-eslint/prefer-ts-expect-error': 'error',

        // Override JS
        // indent
        // indent: 'off',
        // '@typescript-eslint/indent': ['error', 2],
        // no-unused-vars
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        // нет-повторное объявление
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': 'error',
        // не используется до определения
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, variables: true }],
        // висячие запятые
        'comma-dangle': 'off',
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        // объектно-фигурный-интервал
        'object-curly-spacing': 'off',
        '@typescript-eslint/object-curly-spacing': ['error', 'always'],

        // off
        'no-undef': 'off',
        //   constructor(private foo: string) {}
        '@typescript-eslint/no-parameter-properties': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        // Запрещает использование комментариев
        // или требует описаний после директивы (@ts-<directive>ban-ts-comment)
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        // !no-non-null-assertion
        // '@typescript-eslint/no-non-null-assertion': 'off',

        '@typescript-eslint/ban-types': 'off',
        // Запрещает использование определенных типов (ban-types) Number String
        // '@typescript-eslint/no-namespace': 'off',
      },
    },
    {
      files: ['*.json', '*.json5'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'max-len': 'off',
        'jsonc/array-bracket-spacing': ['error', 'never'],
        'jsonc/comma-dangle': ['error', 'never'],
        'jsonc/comma-style': ['error', 'last'],
        'jsonc/indent': ['error', 2],
        'jsonc/key-spacing': [
          'error',
          {
            beforeColon: false,
            afterColon: true,
          },
        ],
        'jsonc/no-octal-escape': 'error',
        'jsonc/object-curly-newline': [
          'error',
          {
            multiline: true,
            consistent: true,
          },
        ],
        'jsonc/object-curly-spacing': ['error', 'always'],
        'jsonc/object-property-newline': [
          'error',
          {
            allowMultiplePropertiesPerLine: true,
          },
        ],
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      parser: 'yaml-eslint-parser',
      rules: {
        'max-len': 'off',
        'spaced-comment': 'off',
      },
    },
    {
      files: ['package.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            pathPattern: '^$',
            order: [
              'publisher',
              'name',
              'displayName',
              'type',
              'version',
              'private',
              'packageManager',
              'description',
              'author',
              'license',
              'funding',
              'homepage',
              'repository',
              'bugs',
              'keywords',
              'categories',
              'sideEffects',
              'exports',
              'main',
              'module',
              'unpkg',
              'jsdelivr',
              'types',
              'typesVersions',
              'bin',
              'icon',
              'files',
              'engines',
              'activationEvents',
              'contributes',
              'scripts',
              'peerDependencies',
              'peerDependenciesMeta',
              'dependencies',
              'optionalDependencies',
              'devDependencies',
              'pnpm',
              'overrides',
              'resolutions',
              'husky',
              'simple-git-hooks',
              'lint-staged',
              'eslintConfig',
            ],
          },
          {
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
            order: { type: 'asc' },
          },
          {
            pathPattern: '^exports.*$',
            order: ['types', 'require', 'import'],
          },
        ],
      },
    },
  ],
  plugins: ['simple-import-sort'],
  globals: {
    defineOptions: 'readonly',
    document: 'readonly',
    navigator: 'readonly',
    window: 'readonly',
  },
  rules: {
    // Возможные проблемы

    // Принудительные return операторы в обратных вызовах методов массива
    'array-callback-return': 'error',

    // Требовать вызов super() в конструкторах
    'constructor-super': 'error',

    // Проверить условия для цикла for
    'for-direction': 'error',

    // Принудительные return операторы в геттерах
    // "allowImplicit": false (по умолчанию) запрещает неявный возврат undefinedс
    'getter-return': [
      'error',
      {
        allowImplicit: true,
      },
    ],

    // Запретить использование асинхронной функции в качестве исполнителя промисов
    'no-async-promise-executor': 'error',

    // Запретить await внутри циклов
    'no-await-in-loop': 'error',

    // Запретить переназначение членов класса
    // class A { }
    // A = 0;
    'no-class-assign': 'error',

    // Запретить сравнение с -0
    'no-compare-neg-zero': 'error',

    // Запретить операторы присваивания в условных выражениях
    'no-cond-assign': 'error',

    // Запретить переназначение const переменных
    'no-const-assign': 'error',

    // Запретить выражения, в которых операция не влияет на значение
    // const value1 = +x == null
    // const isEmpty = x === []
    'no-constant-binary-expression': 'error',

    // Запретить константные выражения в условиях
    'no-constant-condition': 'error',

    // Запретить возвращаемое значение из конструктора
    'no-constructor-return': 'error',

    // Запретить управляющие символы в регулярных выражениях
    'no-control-regex': 'error',

    // Без отладчика
    'no-debugger': 'error',

    // Запретить повторяющиеся аргументы в function в определениях
    'no-dupe-args': 'error',

    // Запретить повторяющиеся члены класса
    'no-dupe-class-members': 'error',

    // Запретить повторяющиеся условия в цепочках if-else-if
    'no-dupe-else-if': 'error',

    // Запретить повторяющиеся ключи в литералах объектов
    'no-dupe-keys': 'error',

    // Запретить повторяющиеся метки case
    'no-duplicate-case': 'error',

    // Запретить импорт повторяющихся модулей
    'no-duplicate-imports': 'error',

    // Запретить пустые классы символов в регулярных выражениях /^abc[]/
    'no-empty-character-class': 'error',

    // Запретить пустые шаблоны деструктурирования
    'no-empty-pattern': 'error',

    // Запретить переназначение исключений в catch предложениях
    'no-ex-assign': 'error',

    // Использовать break
    'no-fallthrough': 'error',

    // Запретить переназначение function объявлений
    'no-func-assign': 'error',

    // Запретить переназначение импортированных привязок
    'no-import-assign': 'error',

    // Запретить переменную или function объявления во вложенных блоках
    'no-inner-declarations': 'error',

    // Запретить недопустимые строки регулярных выражений в RegExp конструкторах
    'no-invalid-regexp': 'error',

    // Запретить неправильные пробелы
    'no-irregular-whitespace': 'error',

    // Запретить литеральные числа, которые теряют точность
    'no-loss-of-precision': 'error',

    // Запретить символы, которые состоят из нескольких кодовых точек в синтаксисе класса символов
    // /^[❇️]$/u.test("❇️") //→ false
    'no-misleading-character-class': 'error',

    // Запретить new операторы с Symbol объектом
    'no-new-symbol': 'error',

    // Запретить вызов свойств глобальных объектов как функций
    'no-obj-calls': 'error',

    // Запретить возвращаемые значения из функций-исполнителей промисов
    'no-promise-executor-return': 'error',

    // Запретить вызов некоторых Object.prototype методов непосредственно на объектах
    'no-prototype-builtins': 'error',

    // Запретить присвоения, в которых обе стороны одинаковы
    'no-self-assign': 'error',

    // Запретить сравнения, когда обе стороны абсолютно одинаковы
    'no-self-compare': 'error',

    // Запретить возвращаемые значения из сеттеров
    'no-setter-return': 'error',

    // Запретить разреженные массивы
    'no-sparse-arrays': 'error',

    // Запретить синтаксис заполнителя литерала шаблона в обычных строках
    'no-template-curly-in-string': 'error',

    // Запретить this/super перед вызовом super() конструкторов
    'no-this-before-super': 'error',

    // Запретить использование необъявленных переменных, если они не указаны в /global/ комментариях
    // typeof если установлено значение true, будут выдаваться предупреждения о переменных, используемых внутри проверки typeof(по умолчанию false).
    'no-undef': [
      'error',
      {
        typeof: true,
      },
    ],

    // Запретить запутанные многострочные выражения
    'no-unexpected-multiline': 'error',

    // Запретить неизмененные условия цикла
    'no-unmodified-loop-condition': 'error',

    // Запретить недостижимый код после операторов return, throw, continue и break
    'no-unreachable': 'error',

    // Запретить циклы с телом, допускающим только одну итерацию
    'no-unreachable-loop': 'error',

    // Запретить операторы потока управления в finally блоках
    'no-unsafe-finally': 'error',

    // Запретить отрицание левого операнда операторов отношения
    // If (!key in object) {
    'no-unsafe-negation': 'error',

    // Запретить использование необязательных цепочек в контекстах, где undefined значение не разрешено
    // (obj?.foo)();
    // DisallowArithmeticOperators: Запретить арифметические операции над необязательными выражениями цепочки
    // (по умолчанию false). Если это true, это правило предупреждает арифметические операции
    // Над необязательными выражениями цепочки, которые могут привести к NaN.
    'no-unsafe-optional-chaining': 'error',

    // Запретить неиспользуемые члены закрытого класса
    'no-unused-private-class-members': 'error',

    // Запретить неиспользуемые переменные
    // 'no-unused-vars': 'error',

    // Запретить использование переменных до их определения
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: true,
        allowNamedExports: true,
      },
    ],

    // Запретить бесполезные обратные ссылки в регулярных выражениях
    'no-useless-backreference': 'error',

    // Запретить задания, которые могут привести к состязаниям из-за использования await или yield
    'require-atomic-updates': 'error',

    // Требовать isNaN() при проверкеNaN
    'use-isnan': 'error',

    // Принудительное сравнение typeof выражений с допустимыми строками
    'valid-typeof': [
      'error',
      {
        requireStringLiterals: true,
      },
    ],

    // Предложения
    // Применение пар геттеров и сеттеров в объектах и классах
    'accessor-pairs': 'error',

    // Требовать фигурные скобки вокруг тел функций стрелок
    'arrow-body-style': ['error', 'as-needed'],

    // Принудительное использование переменных в той области, в которой они определены
    'block-scoped-var': 'error',

    // Применять соглашение об именах camelcase регистра
    camelcase: 'error',

    // Применять или запрещать использование заглавных букв в первой букве комментария
    'capitalized-comments': [
      'off',
      'always',
      {
        ignoreConsecutiveComments: true,
      },
    ],

    // Принудительно использовать методы класса this
    'class-methods-use-this': 'error',

    // Обеспечьте максимальную цикломатическую сложность, разрешенную в программе
    complexity: 'off',

    // Операторы требуют return либо всегда, либо никогда не указывать значения
    'consistent-return': 'off',

    // Обеспечьте согласованное именование при захвате текущего контекста выполнения
    // Consistent-this

    // Обеспечьте согласованный стиль фигурных скобок для всех операторов управления
    curly: 'error',

    /**
     * Требовать default падежи в switch заявлениях
     * или // no default
     */
    'default-case': 'error',
    // Сделать предложения по умолчанию в операторах switch последними
    'default-case-last': 'error',
    // Применяйте точечную нотацию везде, где это возможно
    'dot-notation': 'error',

    // Требовать использования === и !==
    eqeqeq: ['error', 'always'],

    // Требовать, чтобы имена функций совпадали с именем переменной или свойства, которым они назначены
    'func-name-matching': 'warn',

    // Требовать или запрещать именованные function выражения
    'func-names': ['error', 'always'],

    // Обеспечьте согласованное использование function объявлений или выражений
    'func-style': 'off',

    // Требовать сгруппированные пары средств доступа в литералах объектов и классах
    'grouped-accessor-pairs': ['error', 'getBeforeSet'],

    // Требовать for-in, чтобы циклы включали if оператор
    'guard-for-in': 'error',

    // Id-запрещенный список
    'id-denylist': ['off', 'data', 'callback'],

    // Требовать или запрещать логическое присваивание сокращенного логического оператора
    'logical-assignment-operators': ['error', 'always'],

    // Установить максимальное количество классов в файле
    'max-classes-per-file': 'error',

    // Установите максимальную глубину, на которую могут быть вложены блоки
    // max-depth

    // multiline-comment-style

    // Требовать, чтобы имена конструкторов начинались с заглавной буквы
    'new-cap': [
      'error',
      {
        newIsCap: true,
        newIsCapExceptions: [],
        capIsNew: false,
        capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
      },
    ],

    // Запретить использование alert, confirm, и prompt
    'no-alert': 'error',

    // Запретить Array конструкторы
    'no-array-constructor': 'error',

    // Запретить побитовые операторы
    'no-bitwise': 'error',

    // Запретить использование arguments.caller или arguments.callee
    'no-caller': 'error',

    // Запретить лексические объявления в предложениях case
    'no-case-declarations': 'error',

    // Запретить стрелочные функции, если их можно спутать со сравнениями.
    'no-confusing-arrow': 'off',

    // Запретить использование console
    'no-console': 'warn',

    // Запретить удаление переменных
    'no-delete-var': 'error',

    // Явно запрещать операторы деления в начале регулярных выражений
    'no-div-regex': 'error',

    // Запретить else блоки после return операторов в if операторах
    'no-else-return': 'error',

    // Запретить операторы пустых блоков
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],

    // Запретить пустые функции
    'no-empty-function': 'off',

    // Запретить nullсравнения без операторов проверки типов
    'no-eq-null': 'error',

    // Запретить использование eval()
    'no-eval': 'off',

    // Запретить расширение нативных типов
    'no-extend-native': 'error',

    // Запретить ненужные звонки.bind()
    'no-extra-bind': 'error',

    // Запретить ненужные логические приведения
    'no-extra-boolean-cast': 'error',

    // Запретить ненужные ярлыки
    'no-extra-label': 'error',

    // Запретить ненужные точки с запятой
    'no-extra-semi': 'off',

    // Запретить начальные или конечные десятичные точки в числовых литералах
    'no-floating-decimal': 'error',

    // Запретить присваивание нативным объектам или глобальным переменным, доступным только для чтения.
    'no-global-assign': 'error',

    // Запретить преобразование сокращенного типа
    'no-implicit-coercion': 'error',

    // Запретить объявления в глобальной области видимости
    'no-implicit-globals': 'error',

    // Запретить использование eval()-подобных методов
    'no-implied-eval': 'error',

    // Запретить использование this в контекстах, где this значение undefined
    'no-invalid-this': 'error',

    // Запретить использование __iterator__имущества
    'no-iterator': 'error',

    // Запретить метки, имя которых совпадает с именем переменной
    'no-label-var': 'error',

    // Запретить помеченные операторы
    'no-labels': 'error',

    // Запретить ненужные вложенные блоки
    'no-lone-blocks': 'error',

    // Запретить if операторы как единственные операторы в else блоках
    'no-lonely-if': 'error',

    // Запретить объявления функций, которые содержат небезопасные ссылки внутри операторов цикла
    'no-loop-func': 'error',

    // Запретить магические числа
    'no-magic-numbers': 'off',

    // Запретить смешанные бинарные операторы
    'no-mixed-operators': [
      'off',
      {
        groups: [
          ['+', '-', '*', '/', '%', '**'],
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: true,
      },
    ],

    // Запретить использование связанных выражений присваивания
    'no-multi-assign': 'error',

    // Запретить многострочные строки
    'no-multi-str': 'error',

    // Запретить отрицательные условия
    'no-negated-condition': 'off',

    // Запретить вложенные тернарные выражения
    'no-nested-ternary': 'off',

    // Запретить new операторы вне присваиваний или сравнений
    'no-new': 'error',

    // Запретить new операторы с Function объектом
    'no-new-func': 'error',

    // Запретить Object конструкторы
    'no-new-object': 'error',

    // Запретить new операторы с объектами String, Number и Boolean
    'no-new-wrappers': 'error',

    // Запретить \8и \9 экранировать последовательности в строковых литералах
    'no-nonoctal-decimal-escape': 'error',

    // Запретить восьмеричные литералы
    'no-octal': 'error',

    // Запретить восьмеричные escape-последовательности в строковых литералах
    'no-octal-escape': 'error',

    // Запретить переназначение function параметров
    'no-param-reassign': 'off',

    // Запретить унарные операторы ++и--
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true,
      },
    ],

    // Запретить использование __proto__имущества
    'no-proto': 'error',

    // Disallow specified names in exports
    // https://eslint.org/docs/rules/no-restricted-exports
    'no-restricted-exports': [
      'error',
      {
        restrictedNamedExports: [
          // eslint-disable-next-line array-element-newline
          'default', // Use `export default` to provide a default export
          'then', // This will cause tons of confusion when your module is dynamically `import()`ed, and will break in most node ESM versions
        ],
      },
    ],

    // Disallow specific imports
    // https://eslint.org/docs/rules/no-restricted-imports
    'no-restricted-imports': [
      'off',
      {
        paths: [],
        patterns: [],
      },
    ],

    // Disallow certain object properties
    // https://eslint.org/docs/rules/no-restricted-properties
    'no-restricted-properties': [
      'error',
      {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated',
      },
      {
        object: 'global',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'self',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'window',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'global',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        object: 'self',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        object: 'window',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.',
      },
      {
        property: '__defineSetter__',
        message: 'Please use Object.defineProperty instead.',
      },
      {
        object: 'Math',
        property: 'pow',
        message: 'Use the exponentiation operator (**) instead.',
      },
    ],

    // Запретить повторное объявление переменной
    'no-redeclare': 'error',

    // Запретить указанный синтаксис
    'no-restricted-syntax': [
      'error',
      // 'FunctionExpression',
      'DebuggerStatement',
      'LabeledStatement',
      'WithStatement',
    ],

    // Запретить операторы присваивания в return операторах
    'no-return-assign': 'error',

    // Запретить лишнее return await
    'no-return-await': 'error',

    // Запретить javascript:URL
    'no-script-url': 'error',

    // Запретить использование запятых
    'no-sequences': 'error',

    // Запретить объявления переменных из затенения переменных, объявленных во внешней области
    'no-shadow': 'error',

    // Запретить идентификаторам скрывать имена с ограниченным доступом
    'no-shadow-restricted-names': 'error',

    // Запретить тернарные операторы
    'no-ternary': 'off',

    // Запретить инициализацию переменных для undefined
    'no-undef-init': 'off',

    // Запретить висячие символы подчеркивания в идентификаторах
    'no-underscore-dangle': 'off',

    // Запретить тернарные операторы, если существуют более простые альтернативы
    'no-unneeded-ternary': 'error',

    // Запретить неиспользуемые выражения
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],

    // Запретить неиспользуемые ярлыки
    'no-unused-labels': 'error',

    // Запретить ненужные вызовы .call() и .apply()
    'no-useless-call': 'error',

    // Запретить ненужные catchпредложения
    'no-useless-catch': 'error',

    // Запретить ненужные вычисляемые ключи свойств в объектах и классах
    'no-useless-computed-key': 'error',

    // Запретить ненужную конкатенацию литералов или литералов шаблонов
    'no-useless-concat': 'error',

    // Запретить ненужные конструкторы
    'no-useless-constructor': 'error',

    // Запретить ненужные escape-символы
    'no-useless-escape': 'error',

    // Запретить переименование импортируемых, экспортных и деструктурированных назначений под одним и тем же именем
    'no-useless-rename': 'error',

    // Запретить избыточные операторы возврата
    'no-useless-return': 'error',

    // Требовать let или const в место var
    'no-var': 'error',

    // Запретить void операторы
    'no-void': 'error',

    // Disallow usage of configurable warning terms in comments: e.g. todo
    // https://eslint.org/docs/rules/no-warning-comments
    'no-warning-comments': [
      'off',
      {
        terms: ['todo', 'fixme', 'xxx'],
        location: 'start',
      },
    ],

    // Запретить with заявления
    'no-with': 'error',

    // Требовать или запрещать сокращенный синтаксис методов и свойств для литералов объектов
    'object-shorthand': 'error',

    // Обеспечить объявление переменных вместе или по отдельности в функциях
    'one-var': ['error', 'never'],

    // Требовать или запрещать новые строки вокруг объявлений переменных
    // 'one-var-declaration-per-line': 'error',

    // Требовать или запрещать сокращение оператора присваивания, где это возможно
    'operator-assignment': 'error',

    // Требовать использования стрелочных функций для обратных вызовов
    'prefer-arrow-callback': 'error',

    // Требовать const объявления для переменных, которые никогда не переназначаются после объявления
    'prefer-const': 'error',

    // Требовать деструктуризации массивов и/или объектов
    'prefer-destructuring': 'error',

    // Запретить использование Math.pow в пользу ** оператора
    'prefer-exponentiation-operator': 'error',

    // Принудительно использовать именованную группу захвата в регулярном выражении
    'prefer-named-capture-group': 'error',

    // Запретить parseInt() и Number.parseInt() использовать двоичные, восьмеричные и шестнадцатеричные литералы
    'prefer-numeric-literals': 'error',

    // Запретить использование Object.prototype.hasOwnProperty.call() и предпочесть использованиеObject.hasOwn()
    'prefer-object-has-own': 'error',

    // Запретите использование Object.assign с литералом объекта в качестве первого аргумента
    // и вместо этого предпочтите использование распространения объекта.
    'prefer-object-spread': 'error',

    // Требовать использования объектов Error в качестве причин отклонения обещания
    'prefer-promise-reject-errors': 'error',

    // Запретить использование RegExp конструктора в пользу литералов регулярных выражений
    'prefer-regex-literals': 'error',

    // Требовать rest параметры вместо arguments
    'prefer-rest-params': 'error',

    // Требовать операторов спреда вместо .apply()
    'prefer-spread': 'error',

    // Требовать литералы шаблонов вместо конкатенации строк
    'prefer-template': 'error',

    // Требовать заключения в кавычки имен свойств литерала объекта
    'quote-props': ['error', 'as-needed'],

    // Обеспечьте согласованное использование аргумента системы счисления при использовании parseInt()
    radix: ['error', 'as-needed'],

    // Запретить асинхронные функции, у которых нет await выражения
    // 'require-await': 'off',

    // Принудительно использовать u флаг в RegExp
    'require-unicode-regexp': 'off',

    // Требовать, чтобы функции генератора содержали yield
    'require-yield': 'error',

    // Принудительно применять отсортированные декларации импорта в модулях
    'sort-imports': [
      'off',
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],

    // Требовать сортировки ключей объектов
    // 'sort-keys': 'off',

    // Обеспечьте одинаковый интервал после // или /* в комментарии
    'spaced-comment': 'error',

    // Требовать описания символов
    'symbol-description': 'error',

    // Требовать var, чтобы объявления размещались в верхней части их области видимости
    'vars-on-top': 'error',

    // Требовать или запрещать условия "yoda"
    yoda: 'error',

    // Layout & Formatting
    // Применять разрывы строк после открытия и перед закрытием скобок массива
    'array-bracket-newline': [
      'off',
      {
        multiline: true,
      },
    ],

    // Обеспечьте постоянный интервал внутри скобок массива
    'array-bracket-spacing': ['error', 'never'],

    // Применять разрывы строк после каждого элемента массива
    'array-element-newline': [
      'off',
      {
        ArrayExpression: {
          multiline: true,
          minItems: 3,
        },
        ArrayPattern: {
          multiline: true,
          minItems: 4,
        },
      },
    ],

    // Требовать круглых скобок вокруг аргументов стрелочной функции
    'arrow-parens': ['error', 'always'],

    // Обеспечьте постоянный интервал до и после стрелки в стрелочных функциях
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true,
      },
    ],

    // Запрещать или применять пробелы внутри блоков после открытия блока и перед закрытием блока
    'block-spacing': 'error',

    // Обеспечить согласованный стиль скобок для блоков
    'brace-style': 'error',

    // Требовать или запрещать запятые в конце
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],

    // Обеспечьте постоянный интервал до и после запятых
    'comma-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],

    // Применять последовательный стиль запятой
    'comma-style': ['error', 'last'],
    // Обеспечьте постоянный интервал внутри скобок вычисляемого свойства
    'computed-property-spacing': ['error', 'never'],

    // Обеспечьте согласованные новые строки до и после точек
    'dot-location': ['error', 'property'],

    // Требовать или запрещать новую строку в конце файлов
    'eol-last': ['error', 'always'],

    // Требовать или запрещать интервалы между идентификаторами функций и их вызовами
    // 'func-call-spacing': ['error', 'never'],

    // Применять разрывы строк между аргументами вызова функции
    'function-call-argument-newline': ['error', 'consistent'],

    // Обеспечьте согласованные разрывы строк внутри круглых скобок функций
    'function-paren-newline': ['off', 'multiline-arguments'],

    // Обеспечьте постоянный интервал вокруг `*` операторов в функциях-генераторах
    'generator-star-spacing': [
      'error',
      {
        before: false,
        after: true,
      },
    ],

    // Принудительное расположение тел функций стрелок
    'implicit-arrow-linebreak': ['off', 'beside'],

    // Обеспечьте постоянный отступ
    indent: [
      'off',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        StaticBlock: {
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        offsetTernaryExpressions: false,
        ignoreComments: false,
        // List derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
        ignoredNodes: [
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild',
        ],
      },
    ],

    // Обеспечьте последовательное использование двойных или одинарных кавычек в атрибутах JSX.
    'jsx-quotes': ['error', 'prefer-double'],

    // Обеспечьте постоянный интервал между ключами и значениями в свойствах литерала объекта
    'key-spacing': [
      'error',
      {
        beforeColon: false,
        afterColon: true,
      },
    ],

    // Обеспечить постоянный интервал до и после ключевых слов
    'keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
        overrides: {
          return: {
            after: true,
          },
          throw: {
            after: true,
          },
          case: {
            after: true,
          },
        },
      },
    ],

    // Принудительное расположение строковых комментариев
    // line-comment-position

    // Применять согласованный стиль разрыва строки
    'linebreak-style': ['error', 'unix'],

    // Требовать пустые строки вокруг комментариев
    'lines-around-comment': 'off',

    // Требовать или запрещать пустую строку между членами
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: false,
      },
    ],

    // Установить максимальную длину строки
    'max-len': [
      'error',
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],

    // Применять максимальное количество утверждений, разрешенных в строке
    'max-statements-per-line': [
      'off',
      {
        max: 1,
      },
    ],
    // Применять новые строки между операндами троичных выражений
    'multiline-ternary': ['off', 'always-multiline'],
    // Применять или запрещать круглые скобки при вызове конструктора без аргументов
    'new-parens': 'error',

    // Требовать новую строку после каждого вызова в цепочке методов
    'newline-per-chained-call': [
      'off',
      {
        ignoreChainWithDepth: 2,
      },
    ],
    // Запретить ненужные скобки
    'no-extra-parens': [
      'off',
      'all',
      {
        conditionalAssign: true,
        nestedBinaryExpressions: false,
        returnAssign: false,
        ignoreJSX: 'all', // Delegate to eslint-plugin-react
        enforceForArrowConditionals: false,
      },
    ],

    // Запретить смешанные пробелы и табуляции для отступов
    // 'no-mixed-spaces-and-tabs': "error",

    // Запретить несколько пробелов
    'no-multi-spaces': 'error',

    // Запретить несколько пустых строк
    'no-multiple-empty-lines': ['error', { max: 1 }],

    // Запретить несколько пустых строк
    'no-tabs': 'error',

    // Запретить завершающие пробелы в конце строк
    'no-trailing-spaces': 'error',

    // Запретить пробелы перед свойствами
    'no-whitespace-before-property': 'error',

    // Принудительное расположение однострочных операторов
    'nonblock-statement-body-position': ['error', 'below'],
    // Применять согласованные разрывы строк после открытия и перед закрытием фигурных скобок

    // Применять согласованные разрывы строк после открытия и перед закрытием фигурных скобок
    'object-curly-newline': [
      'off',
      {
        ObjectExpression: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ObjectPattern: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ImportDeclaration: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
        ExportDeclaration: {
          minProperties: 4,
          multiline: true,
          consistent: true,
        },
      },
    ],

    // Обеспечьте постоянный интервал внутри фигурных скобок
    'object-curly-spacing': ['error', 'always'],

    // Принудительное размещение свойств объекта на отдельных строках
    'object-property-newline': [
      'error',
      {
        allowAllPropertiesOnSameLine: true,
      },
    ],

    // Обеспечьте согласованный стиль разрыва строки для операторов
    'operator-linebreak': ['off', 'after', { overrides: { '=': 'none' } }],

    // Требовать или запрещать отступы внутри блоков
    'padded-blocks': [
      'error',
      {
        blocks: 'never',
        classes: 'never',
        switches: 'never',
      },
      {
        allowSingleLineBlocks: true,
      },
    ],

    // Требовать или запрещать заполнение строк между операторами
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['for', 'if', 'do', 'while', 'function'],
      },
      {
        blankLine: 'always',
        prev: ['for', 'if', 'do', 'while'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
    ],

    // Обеспечьте последовательное использование обратных, двойных или одинарных кавычек
    quotes: ['error', 'single', { avoidEscape: true }],

    // Обеспечьте соблюдение интервалов между операторами rest and spread и их выражениями
    // rest-spread-spacing

    // Требовать или запрещать точку с запятой вместо ASI
    semi: ['error', 'never'],

    // Обеспечьте постоянный интервал до и после точки с запятой
    'semi-spacing': ['error', { before: false, after: true }],

    // Принудительное расположение точек с запятой
    'semi-style': ['off', 'last'],

    // Обеспечьте постоянный интервал перед блоками
    'space-before-blocks': 'error',

    // Обеспечьте постоянный интервал перед function открывающей скобкой определения
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    // Обеспечьте постоянный интервал внутри круглых скобок
    'space-in-parens': ['error', 'never'],

    // Требовать пробелы вокруг инфиксных операторов
    'space-infix-ops': 'error',

    // Обеспечьте постоянный интервал до или после унарных операторов
    'space-unary-ops': [
      'error',
      {
        words: true,
        nonwords: false,
        overrides: {},
      },
    ],

    // Применять интервалы вокруг двоеточий операторов switch
    'switch-colon-spacing': [
      'error',
      {
        after: true,
        before: false,
      },
    ],

    // Требовать или запрещать пробелы вокруг встроенных выражений строк шаблона
    'template-curly-spacing': ['error', 'never'],

    // Требовать или запрещать интервалы между тегами шаблона и их литералами
    'template-tag-spacing': ['error', 'never'],

    // Требовать или запрещать метку порядка байтов Unicode (BOM)
    'unicode-bom': ['error', 'never'],

    // Требовать скобки вокруг немедленных function вызовов
    'wrap-iife': ['error', 'inside'],

    // Требовать скобки вокруг литералов регулярных выражений
    'wrap-regex': 'off',

    // Требовать или запрещать пробелы вокруг выражений *inyield*
    'yield-star-spacing': ['error', { before: false, after: true }],

    // ==================

    // import
    'import/extensions': 'off',
    // 'import/extensions': ['error', 'ignorePackages'],
    // 'import/export': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    // unicorn
    // TODO: Запретить null
    'unicorn/prefer-text-content': 'error',
    'unicorn/no-keyword-prefix': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-useless-undefined': 'off',
    'unicorn/consistent-function-scoping': 'off',
    'unicorn/no-array-callback-reference': 'off',

    // ts
    'func-call-spacing': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
}
