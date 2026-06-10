const Job = require("../models/Job");

// GET /api/jobs
const handleGetAllJobs = async (req, res) => {
  try {
    const { category, type, search } = req.query;
    let filterQuery = {};

    if (category && category !== "All") {
      filterQuery.category = category;
    }

    if (type && type !== "All") {
      filterQuery.type = type;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filterQuery.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { skills: { $in: [searchRegex] } }
      ];
    }

    const jobs = await Job.find(filterQuery).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Jobs fetched successfully.",
      count: jobs.length,
      jobs
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/jobs/:id
const handleGetJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: "Job opening not found." });
    }
    return res.status(200).json({
      message: "Job details fetched successfully.",
      job
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// POST /api/jobs/seed
const handleSeedJobs = async (req, res) => {
  try {
    const jobCount = await Job.countDocuments();
    
    // Seed only if collection is empty
    if (jobCount > 0) {
      return res.status(200).json({
        message: "Database already has jobs seeded.",
        count: jobCount
      });
    }

    const initialJobs = [
      {
        title: "Frontend Engineer (AI Interface)",
        company: "Stripe",
        logo: "S",
        logoBg: "bg-indigo-600",
        location: "Remote (San Francisco, CA)",
        salary: "$120k - $145k / Yr",
        type: "Full-time",
        category: "Frontend",
        matchScore: 94,
        skills: ["React", "Tailwind CSS", "Next.js", "TypeScript"],
        description: "Stripe is looking for a Frontend Engineer to lead design system implementation for our new AI-assisted billing interfaces. You will work side-by-side with our AI core research group to create high-speed, intuitive dashboard UI systems.",
        responsibilities: [
          "Architect and implement reusable, high-performance UI systems in React and TypeScript.",
          "Optimize web interfaces for sub-second load times and interactive responses.",
          "Ensure layout responsiveness across desktop, tablet, and mobile viewports.",
          "Integrate RESTful and GraphQL API pipelines to feed live telemetry data into dashboards."
        ],
        requirements: [
          "2+ years of professional React development experience in production applications.",
          "Solid mastery of modern TypeScript, CSS architectures, and Tailwind CSS.",
          "Knowledge of performance tuning strategies (bundling, streaming rendering, caching).",
          "Excellent communication skills for cross-functional collaboration with research engineers."
        ],
        benefits: [
          "Top-tier health, dental, and vision insurance policies.",
          "Home office setup stipend ($1,500 one-time setup bonus).",
          "Flexible working hour patterns and unlimited PTO plan.",
          "Annual learning allowance of $2,000 for courses and conferences."
        ]
      },
      {
        title: "Machine Learning Engineering Intern",
        company: "Microsoft",
        logo: "M",
        logoBg: "bg-blue-600",
        location: "Bangalore, India (Hybrid)",
        salary: "₹45k - ₹60k / Mo",
        type: "Internship",
        category: "AI / ML",
        matchScore: 88,
        skills: ["Python", "PyTorch", "NLP", "Scikit-Learn"],
        description: "Microsoft's Cloud & AI group is seeking an ML Engineering Intern to help design and test fine-tuning architectures for regional LLM systems. This is a 6-month hands-on internship with high opportunities for a Pre-Placement Offer (PPO).",
        responsibilities: [
          "Prepare, clean, and analyze high-volume dataset files for tokenization.",
          "Fine-tune pre-trained models using PyTorch libraries and evaluate output alignment.",
          "Build internal pipeline scripts to benchmark model speed, memory, and performance rates.",
          "Collaborate with senior researchers to document experiment results and system variations."
        ],
        requirements: [
          "Enrolled in or graduated from a Bachelor's/Master's program in Computer Science or similar fields.",
          "Strong programming background in Python and hands-on exposure to ML tools (pandas, NumPy).",
          "Familiarity with foundational neural network architectures (Transformers, CNNs).",
          "Basic experience with NLP workflows and model fine-tuning processes."
        ],
        benefits: [
          "Monthly stipend along with local travel/shuttle allowances.",
          "Access to Microsoft campus amenities, recreation facilities, and dining centers.",
          "Mentorship from leading Industry AI scientists and ML leads.",
          "Conversion potential to full-time engineering roles based on internship performance reviews."
        ]
      },
      {
        title: "Full Stack Developer (Next.js & Node)",
        company: "Meta",
        logo: "M",
        logoBg: "bg-sky-600",
        location: "London, UK (On-site)",
        salary: "£85k - £100k / Yr",
        type: "Full-time",
        category: "Full Stack",
        matchScore: 78,
        skills: ["React", "Node.js", "Express", "PostgreSQL"],
        description: "Join Meta's Portal Infrastructure team to construct internal tools helping manage virtual hardware services. You will bridge frontend interfaces and backend server databases, creating highly secure, robust service panels.",
        responsibilities: [
          "Develop high-fidelity user workflows using Next.js framework architectures.",
          "Design scalable, optimized backend structures with Node.js, Express, and PostgreSQL databases.",
          "Build, secure, and document API interfaces using OAuth standards and JWT keys.",
          "Integrate system telemetry databases and visual graph libraries (e.g. D3.js) for logs."
        ],
        requirements: [
          "3+ years of professional full-stack development experience, preferably using SQL databases.",
          "Proficiency in frontend React framework Next.js and backend Node ecosystems.",
          "Clear understanding of database normalization, query optimizations, and index patterns.",
          "Strong familiarity with Docker containers and deployment scripts."
        ],
        benefits: [
          "Highly competitive base compensation packages plus annual stock grants (RSUs).",
          "On-campus complimentary gourmet meals, coffee shops, and wellness services.",
          "Comprehensive health, pension, and fitness allowances.",
          "Relocation packages provided for qualifying candidates."
        ]
      },
      {
        title: "Backend Engineer (Cloud & Scale)",
        company: "Amazon",
        logo: "A",
        logoBg: "bg-orange-500",
        location: "Hyderabad, India (Hybrid)",
        salary: "₹18 - ₹24 LPA",
        type: "Full-time",
        category: "Backend",
        matchScore: 82,
        skills: ["Java", "AWS", "DynamoDB", "Docker"],
        description: "Amazon Web Services (AWS) is seeking a Backend Systems Engineer to join our DB Services scaling team. You will build server architectures that support thousands of concurrent queries per second while maintaining strict SLA levels.",
        responsibilities: [
          "Design, build, and deploy low-latency, scalable microservices in Java.",
          "Configure AWS infrastructure pipelines (Lambda, EC2, API Gateway, DynamoDB).",
          "Monitor system performance metrics, diagnosing bottle-necks or latency peaks.",
          "Create automated tests verifying route reliability and security standards."
        ],
        requirements: [
          "Bachelor's degree in Computer Science, Software Engineering, or equivalent fields.",
          "2+ years of professional backend programming experience in Java, Go, or C++.",
          "Practical experience deploying applications on AWS or Azure platforms.",
          "Good understanding of distributed system architecture and non-relational database structures."
        ],
        benefits: [
          "Competitive LPA salary scales with annual bonuses.",
          "Comprehensive family medical coverage schemes.",
          "Generous employee discounts on Amazon products and services.",
          "Continuous career development programs and global transition opportunities."
        ]
      },
      {
        title: "UI/UX Product Designer",
        company: "Figma",
        logo: "F",
        logoBg: "bg-pink-600",
        location: "Remote (Global)",
        salary: "$110k - $130k / Yr",
        type: "Full-time",
        category: "UI/UX",
        matchScore: 74,
        skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
        description: "Figma is looking for a Product Designer to enhance and simplify core canvas interaction tools. You will lead research panels, construct user flows, and wire detailed mockups that make real-time design editing feel seamless.",
        responsibilities: [
          "Design layout architectures, interactions, and design components inside Figma.",
          "Conduct user research interviews and usability testing sessions to map client bottlenecks.",
          "Collaborate with engineering teams to ensure layout designs align with technical standards.",
          "Contribute to and maintain our global visual UI library design system."
        ],
        requirements: [
          "3+ years of product design experience working with web apps or complex SaaS platforms.",
          "Outstanding portfolio displaying web interface designs, user workflows, and prototypes.",
          "Complete mastery of Figma components, auto-layouts, and interactive variables.",
          "Strong understanding of user psychology and layout accessibility laws (WCAG)."
        ],
        benefits: [
          "100% remote workspace flexibility from any global location.",
          "Quarterly remote team gatherings and annual company retreat coverage.",
          "Home office furniture and workstation hardware allowance.",
          "Co-working space membership reimbursement schemes."
        ]
      },
      {
        title: "Data Scientist Intern",
        company: "Google",
        logo: "G",
        logoBg: "bg-red-500",
        location: "Bangalore, India",
        salary: "₹75k / Mo",
        type: "Internship",
        category: "Data Science",
        matchScore: 91,
        skills: ["Python", "SQL", "TensorFlow", "Pandas"],
        description: "Google's Ads Optimization division is hiring a Data Science Intern to develop statistical models analyzing advertiser campaigns. You will analyze high-volume dataset pipelines and help suggest visual automation tactics.",
        responsibilities: [
          "Clean, manage, and model millions of analytical campaign data points.",
          "Build regression, clustering, and decision-tree algorithms to evaluate user behaviors.",
          "Create visual dashboard displays showing marketing campaign outcomes.",
          "Communicate technical insights to product management and client strategy teams."
        ],
        requirements: [
          "Currently pursuing a Degree in Data Science, Statistics, Computer Science, or Math fields.",
          "Excellent command over Python and numerical modeling packages (Pandas, NumPy, Scipy).",
          "Strong knowledge of SQL, join queries, and database optimization.",
          "Basic experience with Deep Learning frameworks like TensorFlow or Keras."
        ],
        benefits: [
          "Attractive monthly stipend package.",
          "Complimentary high-quality meals and snacks on campus.",
          "High converting path to Google's Graduate Program.",
          "Access to internal technology workshops, classes, and research seminars."
        ]
      }
    ];

    const seeded = await Job.insertMany(initialJobs);

    return res.status(201).json({
      message: "Initial jobs seeded successfully.",
      count: seeded.length,
      jobs: seeded
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// POST /api/jobs
const handleCreateJob = async (req, res) => {
  try {
    const jobData = req.body;
    const newJob = await Job.create(jobData);

    // After creating a job, let's find users who have overlapping skills
    // In a real large-scale app, this would be a background queue. For now, it's inline.
    const User = require("../models/User");
    const Notification = require("../models/Notification");
    const { sendEmail } = require("../utils/emailService");

    // Get all users
    const users = await User.find({});
    
    // Check overlaps
    for (const user of users) {
      if (!user.skills || user.skills.length === 0) continue;

      // Check if any of the job's skills match the user's skills (case-insensitive)
      const userSkills = user.skills.map(s => s.toLowerCase());
      const jobSkills = newJob.skills.map(s => s.toLowerCase());
      
      const hasMatch = jobSkills.some(skill => userSkills.includes(skill));

      if (hasMatch) {
        // Create Notification
        await Notification.create({
          userId: user._id,
          title: "New Job Match! 🎯",
          message: `We found a new job: ${newJob.title} at ${newJob.company} that matches your skills.`,
          type: "JOB_MATCH"
        });

        // Send Email
        if (user.email) {
          await sendEmail({
            to: user.email,
            subject: `New Job Match: ${newJob.title} at ${newJob.company}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4f46e5; text-align: center;">New Job Match Alert!</h2>
                <p>Hi <strong>${user.fullName || 'User'}</strong>,</p>
                <p>A new job was just posted that matches your skills!</p>
                <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin: 0; color: #1e293b;">${newJob.title}</h3>
                  <p style="margin: 5px 0 0 0; color: #64748b;">${newJob.company} - ${newJob.location}</p>
                </div>
                <p>Log in to your CareerSync AI dashboard to apply before the position closes.</p>
                <br/>
                <p>Best regards,</p>
                <p><strong>The CareerSync AI Team</strong></p>
              </div>
            `
          });
        }
      }
    }

    return res.status(201).json({
      message: "Job created successfully.",
      job: newJob
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// PUT /api/jobs/:id
const handleUpdateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const updateData = req.body;
    
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      updateData,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found." });
    }

    return res.status(200).json({
      message: "Job updated successfully.",
      job: updatedJob
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// DELETE /api/jobs/:id
const handleDeleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    
    const deletedJob = await Job.findByIdAndDelete(jobId);
    
    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found." });
    }

    // Cascade delete associated applications
    const Application = require("../models/Application");
    await Application.deleteMany({ jobId });

    return res.status(200).json({
      message: "Job and associated applications deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/jobs/:id/match
const handleGetJobMatch = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    const mongoose = require("mongoose");
    if (!jobId || jobId === 'undefined' || !mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid job ID." });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found." });

    const User = require("../models/User");
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    // Extract user skills
    const userSkillsSet = new Set();
    if (user.skills) {
      user.skills.split(",").forEach(s => userSkillsSet.add(s.trim().toLowerCase()));
    }
    if (user.verifiedSkills) {
      user.verifiedSkills.forEach(s => userSkillsSet.add(s.trim().toLowerCase()));
    }

    // Compare with job skills
    let matchCount = 0;
    const jobSkills = job.skills || [];
    if (jobSkills.length === 0) {
      return res.status(200).json({ matchScore: 100 }); // No skills required
    }

    jobSkills.forEach(skill => {
      if (userSkillsSet.has(skill.toLowerCase())) {
        matchCount++;
      }
    });

    const matchScore = Math.round((matchCount / jobSkills.length) * 100);

    return res.status(200).json({
      matchScore,
      matchedSkills: matchCount,
      totalSkills: jobSkills.length
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

module.exports = {
  handleGetAllJobs,
  handleGetJobById,
  handleSeedJobs,
  handleCreateJob,
  handleUpdateJob,
  handleDeleteJob,
  handleGetJobMatch
};
