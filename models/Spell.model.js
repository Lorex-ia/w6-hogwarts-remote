const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const spellSchema = new Schema(
    {
        spellname: {
        type: String,
        trim: true,
        required: true,
        },

        description: {
            type: String,
            trim: true,
            required: true,
            },

        difficulty: {
            type: Number,
            required: true,
            },
    
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
    }
    );

const Spell = model("Spell", spellSchema);

module.exports = Spell;