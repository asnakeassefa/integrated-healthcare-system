// import User from '../user/model';
// import Staff from '../staff/model';
// import Visit from './model';

// const createVisitHistory = async (req, res, next) => {
//   try {
//     // Extract data from th body
//     const {userId, staffId, visitDate, appointmentDate } = req.body;

//     // Fetch the user and staff records from the database
//     const user = await User.findById(userId);
//     const staff = await Staff.findById(staffId);

//     // If either user or staff is not found, return an error
//     if (!user || !staff) {
//       return res.status(404).json({ error: "User or Staff not found" });
//     }

//     // Create a new Visit instance
//     const newVisit = new Visit({
//       user,
//       staff,
//       visitDate,
//       appointmentDate
//     });

//     // Save the new visit to the database
//     const savedVisit = await newVisit.save();

//     res.status(201).json(savedVisit); // Respond with the saved visit data
//   } catch (error) {
//     console.error("Error creating visit:", error);
//     res.status(500).json({ error: "Failed to create visit" }); // Respond with an error
//   }
// }

// // get all visit history

// const getAllVisitHistory = async (req, res, next) => {
//   try {
//     const visits = await Visit.find(); // Fetch all visit history records from the database
//     res.status(200).json(visits);
//   } catch (error) {
//     console.error("Error fetching visit history:", error);
//     res.status(500).json({ error: "Failed to fetch visit history" });
//   }
// }

// // get visit history for a user
// const getVisitHistoryByUser = async (req, res, next) => {
//   try {
//     const { userId } = req.params;
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     const visits = await Visit.find({ user: user });
//     res.status(200).json(visits);
//   } catch (error) {
//     console.error("Error fetching visit history for user:", error);
//     res.status(500).json({ error: "Failed to fetch visit history for user" });
//   }
// }
// // get visit history for a staff

// const getVisitHistoryByStaff = async (req, res, next) => {
//   try {
//     const { staffId } = req.params;
//     const staff = await Staff.findById(staffId);
//     if (!staff) {
//       return res.status(404).json({ error: "Staff not found" });
//     }
//     const visits = await Visit.find({ staff: staff });
//     res.status(200).json(visits);
//   } catch (error) {
//     console.error("Error fetching visit history for staff:", error);
//     res.status(500).json({ error: "Failed to fetch visit history for staff" });
//   }
// }


// // get the past visits from a specific date
// const getVisitHistoryByDate = async (req, res, next) => {
//   try {
//     const { date } = req.params;
//     const visits = await Visit.find({ visitDate: { $lt: date } });
//     res.status(200).json(visits);
//   } catch (error) {
//     console.error("Error fetching past visits:", error);
//     res.status(500).json({ error: "Failed to fetch past visits" });
//   }
// }


// // get visit history by appointment date
// const getVisitHistoryByAppointmentDate = async (req, res, next) => {
//   try {
//     const { date } = req.params;
//     const visits = await Visit.find({ appointmentDate: date });
//     res.status(200).json(visits);
//   } catch (error) {
//     console.error("Error fetching visit history by appointment date:", error);
//     res.status(500).json({ error: "Failed to fetch visit history by appointment date" });
//   }
// }
 
// export default {
//   createVisitHistory,
//   getAllVisitHistory,
//   getVisitHistoryByUser,
//   getVisitHistoryByStaff,
//   getVisitHistoryByDate,
//   getVisitHistoryByAppointmentDate
// }
