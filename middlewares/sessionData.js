module.exports = function(req, res, next) {
    // Данные сессии для шаблонов
    res.locals.sessionID = req.sessionID;
    res.locals.sessionCounter = req.session.counter || 0;
    res.locals.lastRequest = req.session.lastRequest || 'только что';
    res.locals.sessionExpires = '60 секунд';
    
    next();
};