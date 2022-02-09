const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

//@desc     Get all appointments
//@route    GET /api/v1/appointments
//@access   Public
exports.getAppointments=async (req,res,next)=>{
    let query;
     //General users can see only their appointments!
    if(req.user.role !== 'admin'){ 
        query=Appointment.find({user:req.user.id}).populate({
            path:'hospital',
            select: 'name province tel'
        });        
    }else{ //If you are an admin, you can see all!
        query=Appointment.find().populate({
            path:'hospital',
            select: 'name province tel'
        });
    }
    try {
        const appointments= await query;

        res.status(200).json({
            success:true,
            count:appointments.length,
            data: appointments
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Cannot find Appointment"});    
    }
    
};

//@desc     Get single appointment
//@route    GET /api/v1/appointments/:id
//@access   Public
exports.getAppointment=async (req,res,next)=>{
        try {
            const appointment= await Appointment.findById(req.params.id).populate({
                path: 'hospital',
                select: 'name description tel'
            });
        
            if(!appointment){
                return res.status(404).json({success:false,message:`No appointment with the id of ${req.params.id}`});        
    
        }
        
            res.status(200).json({
                success:true,
                data: appointment
            });
        } catch (error) {        
            console.log(error);
            return res.status(500).json({success:false,message:"Cannot find Appointment"});        
        }
        
    };
    
//@desc     Add appointment
//@route    POST /api/v1/hospitals/:hospitalId/appointment
//@access   Private
exports.addAppointment=async (req,res,next)=>{
        try {
            req.body.hospital=req.params.hospitalId;
    
            const hospital= await Hospital.findById(req.params.hospitalId);
    
            if(!hospital){
               return res.status(404).json({success:false,message:`No hospital with the id of ${req.params.hospitalId}`});        
            }
    
            const appointment = await Appointment.create(req.body);
    
            res.status(200).json({
                success:true,
                data: appointment
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({success:false,message:"Cannot create Appointment"});   
        }
        
    };