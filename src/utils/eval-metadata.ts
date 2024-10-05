// Определим тип для формул и контекста
export type Value = string | number;
export type FormulaItem = { key: string; formula: Value };
export type Formulas = { [key: string]: Value };
export type Context = { [key: string]: Value };

const isNum = (num: Value) =>
  typeof num !== "object" &&
  !Number.isNaN(
    +String(
      (String(num) || "").replace(/[^0-9\.\-e]/, "") !== String(num) ||
        num === ""
        ? NaN
        : num
    )
  );

// Функция для конвертации массива формул в объект формул
function convertFormulas(formulaArray: FormulaItem[]): Formulas {
  const formulas: Formulas = {}; // Результирующий объект

  // Проходим по каждому элементу массива и добавляем его в объект
  for (const item of formulaArray) {
    if (item !== undefined) {
      formulas[item.key.replace(/^\$/, "")] = item.formula;
    }
  }

  return formulas;
}

function tryConvertNumeric(formula: Value) {
  // Преобразуем строковые числа в числа, если возможно
  let numericFormula;
  try {
    numericFormula = eval(formula.toString());
  } catch {
    numericFormula = formula;
  }
  return numericFormula;
}

// Функция для получения context из формул
function evaluateContext(formulas: Formulas): Context {
  const context: Context = {};

  for (const key in formulas) {
    const formula = formulas[key];

    // Проверяем, является ли формула явно заданной константой
    if (
      typeof formula === "number" ||
      (typeof formula === "string" && !formula.includes("$"))
    ) {
      context[key] = tryConvertNumeric(formula);
    }
  }

  return context;
}

// Функция для рекурсивного вычисления формул
function evaluateFormulas(formulas: Formulas, context: Context): Context {
  const evaluatedFormulas: Context = {};

  function recursiveEvaluate(formula: Value): Value {
    // Если формула — это простое число или строка, возвращаем её как есть
    if (
      typeof formula === "number" ||
      (typeof formula === "string" && !formula.includes("$"))
    ) {
      return tryConvertNumeric(formula);
    }

    if (typeof formula !== "string") {
      throw new Error("Формула должна быть строкой.");
    }

    // Заменяем переменные ($age, $gender и т.д.) в формуле на значения из context или вычисленных формул
    const expression = formula.replace(/\$(\w+)/g, (_, key) => {
      // Если переменная уже вычислена, используем её
      if (key in evaluatedFormulas) {
        return evaluatedFormulas[key].toString();
      }
      // Если переменная есть в context, используем её
      if (key in context) {
        const value = context[key];
        // Если значение переменной — строка, обрамляем её в кавычки
        return typeof value === "string" ? `'${value}'` : value.toString();
      }
      // Если переменная — это формула, вычисляем её рекурсивно
      if (key in formulas) {
        return recursiveEvaluate(formulas[key]).toString();
      }
      throw new Error(`Переменная ${key} не найдена`);
    });

    // Выполняем вычисление выражения с помощью eval
    return eval(expression);
  }

  // Проходим по каждой формуле и вычисляем её
  for (const key in formulas) {
    try {
      evaluatedFormulas[key] = recursiveEvaluate(formulas[key]);
    } catch (error) {
      // Если возникает ошибка, сохраняем её как строку
      evaluatedFormulas[key] =
        `${error instanceof Error ? error.message : String(error)}`;
    }
  }

  return evaluatedFormulas;
}

// Функция для вычисления метаданных
export function evaluateMetadata(formulaArray: FormulaItem[]): Context {
  const formulas = convertFormulas(formulaArray);
  const context = evaluateContext(formulas);
  const evaluated = evaluateFormulas(formulas, context);
  return evaluated;
}
