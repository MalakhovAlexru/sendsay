/**
 * Тестирование формы авторизации на странице /signin.
 * Проверка отображения элементов формы:
 * 1. focus на элементе ввода логина пользователя, если поле пустое
 * 2. проверка появления поля ошибки с информацией (на выбранном языке), после смены фокуса на другое поле формы
 * 
 * Проверка наличия ссылок на эвторостепенных элементах управления:
 * Логотип - /
 * "Забыли пароль" - /signin/forgot-password
 * "Корпортаивный портал" - /signin/corporate
 * "Зарегестрируйтесь" - /signup.html
 * "English version"/"Русская версия" - переключение языка отображаемых элементов (отображаемые кнопки поменяли свои названия)
 */



import {
    correctLoginData
} from '../../loginConf';

const realID = correctLoginData;

// Раскоментировать и заполнить форму корректными для аутентификации данными для запуска теста
// const realID = {
//     login: '',
//     password: ''
// }

const fakeID = {
    login: 'fakeLogin@mail.com',
    password: '12345678'
};

function linksCheck(el, btnName) {

    let label = ""

    if (language === 'rus') {
        label = btnName['labelRus']
    } else {
        label = btnName['labelEng']
    }

    cy.get(el).contains(label).should('have.attr', 'href', btnName.link)
}

Cypress.Commands.add('logIn', (personID, check = false) => {

    // Проверка возникновения ошибки об пустых формах логин/пароль
    if (check) {
        cy.get('.Button.Button--brand.Button--large').contains(language === 'rus' ? btnNames.signIn.labelRus : btnNames.signIn.labelEng).click()
        cy.get('[name="login"]').parent().filter('.is-invalid')
        cy.get('[name="password"]').parent().filter('.is-invalid')
    }

    // Ввод логина и пароля
    cy.get('[name="login"]').clear()
    cy.get('[name="login"]').type(personID.login)
    cy.get('[name="password"]').clear()
    cy.get('[name="password"]').type(personID.password)
    cy.get('.Button.Button--brand.Button--large').contains(language === 'rus' ? btnNames.signIn.labelRus : btnNames.signIn.labelEng).click()

    // Если введены не правильные логин и/или пароль - выводится сообщение об ошибке
    if (check) {
        cy.get(".signin-form").children().should('have.attr', 'class', 'FormErrorField')
    } else {
        cy.get('.signin-form').children().not('FormErrorField')
    }
})

// Переменные для тестов
const btnNames = {
    forgotePass: {
        labelRus: 'Забыли пароль?',
        labelEng: 'Forgot password?',
        link: '/signin/forgot-password'
    },
    corporate: {
        labelRus: 'Корпоративный вход',
        labelEng: 'Corporate sign in?',
        link: '/signin/corporate'
    },
    signUp: {
        labelRus: 'Зарегистрируйтесь',
        labelEng: 'Corporate sign in?',
        link: 'https://sendsay.ru/signup.html'
    },
    signIn: {
        labelRus: 'Войти',
        labelEng: 'Sign in'
    }
};

let language = '';

// ТЕСТЫ

describe('Inspect sigIn form', function () {

    beforeEach(() => {

        //Переход на сайт и проверка выбранного языка 

        cy.visit('/').then(() => {
            language = cy.get(".signin-layout__footer .signin-layout__language").contains("English version") ? 'rus' : 'eng';
        })
    })

    // Проверка работоспособности дополнительных кнопок

    it('check the buttons name and links', () => {
        cy.get('.signin-layout__wrapper').then((data) => {
            cy.get(data).children().should('have.attr', 'href', 'https://sendsay.ru/')
        })
        cy.get('.signin-footer').children().then((data) => {
            linksCheck(data, btnNames.forgotePass);
            linksCheck(data, btnNames.corporate);
            linksCheck(data, btnNames.signUp);
        })
    })

    // Провека появления ошибки о пустом логине/пароле и запрос на отправку формы (непраильные данные, атем корректные данные). Корректнные данные должны быть введены в realID

    it('check the login and password forms', () => {
        cy.get('.signin-form').then(() => {
            cy.logIn(fakeID, true)
            cy.logIn(realID)
        })
    })
})

export {
    realID
}