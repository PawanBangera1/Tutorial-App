const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

exports.create = (req,res)=>{

    if(!req.body.title){
        res.status(400).json({status: "error", message: "Content can not be empty!"});
        return;
    }

    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };

    Tutorial.create(tutorial).then(data=>{
        res.status(201).json({status: "success", message: "Tutorial created successfully", data: data});
    }).catch(err=>{
        res.status(500).json({status: "error", message: "Error occurred while creating tutorial"});
    });
}

exports.findAll = (req,res)=>{
    const title = req.query.title;
    var condition = title ? {title: {[Op.iLike]: `%${title}%`}} : null;

    Tutorial.findAll({where: condition}).then(data=>{
        res.status(200).json({status: "success", message: "Tutorials retrieved successfully", data: data});
    }).catch(err=>{
        res.status(500).json({status: "error", message: "Error occurred while retrieving tutorials"});
    });
}

exports.findOne = (req,res)=>{
    const id = req.params.id;

    Tutorial.findByPk(id).then(data=>{
        if(data){
            res.status(200).json({status: "success", message: "Tutorial retrieved successfully", data: data});
        } else{
            res.status(404).json({status: "error", message: `Cannot find Tutorial with id=${id}`});
        }
    }).catch(err=>{
        res.status(500).json({status: "error", message: `Error occurred while retrieving tutorial with id=${id}`});
    });
}

exports.update = (req,res)=>{
    const id = req.params.id;

    Tutorial.update(req.body, {
        where: {id: id}
    }).then(num=>{
        if(num == 1){
            res.status(200).json({status: "success", message: "Tutorial was updated successfully"});
        } else{
            res.status(404).json({status: "error", message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found!`});
        }
    }).catch(err=>{
        res.status(500).json({status: "error", message: `Error occurred while updating tutorial with id=${id}`});
    });
}

exports.delete = (req,res)=>{
    const id = req.params.id;

    Tutorial.destroy({
        where: {id:id}
    }).then(num=>{
        if(num == 1){
            res.status(200).json({status: "success", message: "Tutorial was deleted successfully"});
        } else{
            res.status(404).json({status: "error", message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`});
        }
    }).catch(err=>{
        res.status(500).json({status: "error", message: `Could not delete Tutorial with id=${id}`});
    });
}

exports.deleteAll = (req,res)=>{
    Tutorial.destroy({
        where:{},
        truncate: false
    })
    .then(nums=>{
        res.status(200).json({status: "success", message: `${nums} Tutorials were deleted successfully`});
    }).catch(err=>{
        res.status(500).json({status: "error", message: "Error occurred while deleting tutorials"});
    }); 
}

exports.findAllPublished = (req,res)=>{
    Tutorial.findAll({where: {published: true}}).then(data=>{
        res.status(200).json({status: "success", message: "Tutorials retrieved successfully", data: data});
    }).catch(err=>{
        res.status(500).json({status: "error", message: "Error occurred while retrieving tutorials"});
    });
}