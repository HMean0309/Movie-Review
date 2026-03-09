const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //Kiem tra coi co email nay chua
        const existingUser = await User.findOne({ 
            $or: [{ email: email }, { username: username }] 
        });
        
        if(existingUser) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc Email đã được sử dụng' });
        }
        //Ma hoa mat khau
        const salt = await bcrypt.genSalt(10);
        const hashedPassword =  await bcrypt.hash(password, salt);

        //Tao user moi
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Đăng ký thất bại' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Kiem tra user co ton tai khong
        const user = await User.findOne({ email});
        if(!user) {
            return res.status(400).json({ message: 'Email sai hoặc tài khoản không tồn tại' });
        }

        //Kiem tra mat khau
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Sai mật khẩu' });
        }

        //Tao token
        const token = jwt.sign(
            { id: user._id, roles: user.roles },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Đăng nhập thành công',
            token: token,
            user: {
                username: user.username,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Đăng nhập thất bại' });
    }
};

module.exports = {
    register,
    login
};