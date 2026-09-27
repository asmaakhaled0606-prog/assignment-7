import userModel from "../../DB/models/user.model.js"

export const signUp = async (req, res, next) => {
    try {

        const user = await userModel.findOne({ email: req.body.email });

        if (user) {
            return res.status(409).json({ message: "Email already exists" })
        }

        const newUser = await userModel.create(req.body)

        return res.status(201).json({ message: "User created successfully", data: newUser });

    } catch (error) {
        return res.status(500).json({ message: "Could'nt create user", error: error.message });
    }
};

export const login = async (req, res, next) => {
    try {

        const user = await userModel.findOne({
            email: req.body.email,
            password: req.body.password
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        return res.status(200).json({ message: "Login successfully", data: user });

    } catch (error) {
        return res.status(500).json({ message: "Could'nt find user", error: error.message });
    }
};

export const updateUser = async (req, res, next) => {

    try {

        const user = await userModel.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        if (req.body.email) {

            const emailExists = await userModel.findOne({
                email: req.body.email
            });

            if (emailExists) {

                return res.status(409).json({
                    message: "Email already exists"
                });
            }
        }

        delete req.body.password;

        const updatedUser = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        return res.status(200).json({
            message: "User updated successfully",
            data: updatedUser
        });

    } catch (error) {

        return res.status(500).json({
            message: "Could'nt find user",
            error: error.message
        });
    }
};

export const deleteUser = async(req,res,next)=>{
    try{

        const user = await userModel.findByIdAndDelete(req.query.id);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
                message: "User deleted successfully"
            });

    }catch(error){
        return res.status(500).json({
            message: "Could'nt find user",
            error: error.message
        });
    }
};

export const getUser = async (req, res, next) => {

    try {

        const user = await userModel.findById(req.query.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            data: user
        });

    } catch (error) {

        return res.status(500).json({
            message: "Couldn't fetch user",
            error: error.message
        });
    }
};