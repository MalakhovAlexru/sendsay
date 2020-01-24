/**
 * Создание новой рассылки:
 * 1. создать заполнить все поля необходимые для отправки письма
 * 2. проверить, что при попытке ввести пустое поле - выводится сообщение об ошибке
 */

import {
    realID
} from './auth-form.spec'

describe('Create message', function () {

    it('go to the page', () => {
        cy.get('[href = "/campaigns"]').click()
    })

    // Вызываем диалоговое окнр создания нового письма

    it('call wizzard', () => {
        cy.get('.action-button__wrapper').click()
        cy.get(':nth-child(1) > .ChannelMenuItem > .ChannelMenuItem-wrapper').contains('Email').click()
    })

    // Определяем список получателей

    it('select recipient list', () => {
        cy.wait(1000)
        cy.contains('Выбрать аудиторию').click()
        cy.contains('Сохранить').click()
        cy.get('.field-layout__error').contains('Необходимо заполнить поле')
        cy.contains('Выберете список').click();
        cy.contains('Доступные').click()
        cy.wait(1000)
        cy.contains('Сохранить').click()
    })

    // Заполняем данные для отправки письма

    it('settup Sender and subject', () => {
        cy.wait(1000)
        cy.contains('Отправитель').click()
        cy.contains('Сохранить').click()
        cy.get('.Select-target > .TextArea > .TextArea-input').parent().filter('.is-invalid')
        cy.get(':nth-child(2) > .field-layout ').find('.field-layout__error')
        cy.get('.field-layout__input > .TextArea > .TextArea-input').parent().filter('.is-invalid')

        cy.get('.Select-target > .TextArea > .TextArea-input').type('Александр')
        cy.get('.SelectButton').click()
        cy.get('.Menu > .Menu-content .MenuItem').contains(realID.login).click()

        cy.get('.field-layout__input > .TextArea > .TextArea-input').type('Test letter')
        cy.contains('Сохранить').click()
    })

    // Текст письма

    it('settup the body', () => {
        cy.wait(1000)
        cy.contains('Создать письмо').click()
        cy.get('.GalleryCards-content > :nth-child(1) > .GalleryCard-preview > .GalleryCard-previewContent').click()
        cy.contains('Сохранить и закрыть').click()
    })

    // Отправка письма

    it('send the letter', () => {
        cy.wait(1000)
        cy.contains('Отправить').click()
        cy.get('.dialog__action-button > .Button > .Button-wrapper').click()
    })

})