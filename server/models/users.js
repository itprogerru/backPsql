module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        name: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true,
                notEmpty: true,
                isUnique: function (value, next) {
                    var self = this;
                    Users.find({where: {email: value}})
                        .then(function (user) {
                            // reject if a different user wants to use the same email
                            if (user && self.id !== user.id) {
                                return next('Email already in use!');
                            }
                            return next();
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {});
    return Users;
};