from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import Index
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
import logging

app = Flask(__name__)
CORS(app, origins="http://localhost:3000")
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable query logging for slow queries
# app.config['SQLALCHEMY_ECHO'] = True  Logs all SQL queries
# app.config['SQLALCHEMY_RECORD_QUERIES'] = True  Allows access to query statistics

# Set up logging for queries to track time
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

db = SQLAlchemy(app)

# Patient Table
class Patient(db.Model):
    patient_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer, nullable=False, index=True)
    blood_type = db.Column(db.String(5), nullable=False)

# Physician Table
class Physician(db.Model):
    physician_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    specialty = db.Column(db.String(100), nullable=False, index=True)

# Appointment Table
class Appointment(db.Model):
    appointment_id = db.Column(db.Integer, primary_key=True, index=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient.patient_id'), nullable=False)
    physician_id = db.Column(db.Integer, db.ForeignKey('physician.physician_id'), nullable=False)
    date = db.Column(db.String(10), nullable=False)  # Format: YYYY-MM-DD
    time = db.Column(db.String(5), nullable=False)   # Format: HH:MM
    finished = db.Column(db.Boolean, default=False)
    diagnosis = db.Column(db.Text, nullable=True)
    treatment = db.Column(db.Text, nullable=True)

    # Relationships
    patient = db.relationship('Patient', backref=db.backref('appointments', lazy=True))
    physician = db.relationship('Physician', backref=db.backref('appointments', lazy=True))

    __table_args__ = (
        Index('idx_patient_finished', 'patient_id', 'finished'),
        Index('idx_physician_finished', 'physician_id', 'finished'),
        Index('idx_date_time', 'date', 'time'),
    )

# Prescription Table
class Prescription(db.Model):
    prescription_id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointment.appointment_id'), nullable=False)
    drug_id = db.Column(db.Integer, db.ForeignKey('medication_inventory.drug_id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    frequency = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float, nullable=False)  # Can be dynamically calculated

    # Relationships
    appointment = db.relationship('Appointment', backref=db.backref('prescriptions', lazy=True))
    medication = db.relationship('MedicationInventory', backref=db.backref('prescriptions', lazy=True))

# Medication Inventory Table
class MedicationInventory(db.Model):
    drug_id = db.Column(db.Integer, primary_key=True)
    drug_name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    stock_quantity = db.Column(db.Integer, nullable=False)
    bulk_cost = db.Column(db.Float, nullable=False)

# Route to handle patient signup
@app.route('/signup/patient', methods=['POST'])
def signup_patient():
    data = request.get_json()
    
    # Check if email already exists
    existing_patient = Patient.query.filter_by(email=data['email']).first()
    if existing_patient:
        return jsonify({'error': 'Email already exists'}), 400

    # Hash the password before storing it
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    # Create new patient
    new_patient = Patient(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        age=data['age'],
        blood_type=data['blood_type']
    )

    db.session.add(new_patient)
    db.session.commit()

    return jsonify({'message': 'Patient signed up successfully'}), 201

@app.route('/forgot-password/patient', methods=['POST'])
def forgot_password_patient():
    data = request.get_json()

    # Find the patient by email
    patient = Patient.query.filter_by(email=data['email']).first()

    if not patient:
        return jsonify({'error': 'Email not found'}), 400

    # Generate hashed new password
    new_hashed_password = generate_password_hash(data['new_password'], method='pbkdf2:sha256')

    # Update password in the database
    patient.password = new_hashed_password
    db.session.commit()

    return jsonify({'message': 'Password updated successfully'}), 200

# Route to handle patient login
@app.route('/login/patient', methods=['POST'])
def login_patient():
    data = request.get_json()

    # Get the patient by email
    patient = Patient.query.filter_by(email=data['email']).first()

    if not patient or not check_password_hash(patient.password, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 400

    # Assuming successful login, return a success message
    return jsonify({'message': 'Login successful', 'patient_id': patient.patient_id}), 200

# Route to handle physician signup
@app.route('/signup/physician', methods=['POST'])
def signup_physician():
    data = request.get_json()

    # Check if email already exists
    existing_physician = Physician.query.filter_by(email=data['email']).first()
    if existing_physician:
        return jsonify({'error': 'Email already exists'}), 400

    # Hash the password before storing it
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    # Create new physician
    new_physician = Physician(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        specialty=data['specialty']
    )

    db.session.add(new_physician)
    db.session.commit()

    return jsonify({'message': 'Physician signed up successfully'}), 201

@app.route('/forgot-password/physician', methods=['POST'])
def forgot_password_physician():
    data = request.get_json()

    # Find the physician by email
    physician = Physician.query.filter_by(email=data['email']).first()

    if not physician:
        return jsonify({'error': 'Email not found'}), 400

    # Generate hashed new password
    new_hashed_password = generate_password_hash(data['new_password'], method='pbkdf2:sha256')

    # Update password in the database
    physician.password = new_hashed_password
    db.session.commit()

    return jsonify({'message': 'Password updated successfully'}), 200

# Route to handle physician login
@app.route('/login/physician', methods=['POST'])
def login_physician():
    data = request.get_json()

    # Get the physician by email
    physician = Physician.query.filter_by(email=data['email']).first()

    if not physician or not check_password_hash(physician.password, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 400

    # Assuming successful login, return a success message
    return jsonify({'message': 'Login successful', 'doctor_id': physician.physician_id}), 200

@app.route("/physicians", methods=["GET"])
def get_physicians():
    physicians = Physician.query.all()
    physician_list = [{"physician_id": p.physician_id, "name": p.name, "specialty": p.specialty} for p in physicians]
    return jsonify(physician_list)

@app.route("/create-appointment", methods=["POST"])
def create_appointment():
    data = request.json
    patient_id = data.get("patient_id")
    physician_id = data.get("physician_id")
    date = data.get("date")
    time = data.get("time")

    if not patient_id or not physician_id or not date or not time:
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    # Check for clash
    conflict = Appointment.query.filter_by(physician_id=physician_id, date=date, time=time).first()
    if conflict:
        return jsonify({"success": False, "error": "Time slot already booked for this physician."}), 409

    new_appointment = Appointment(
        patient_id=patient_id,
        physician_id=physician_id,
        date=date,
        time=time,
        finished=False
    )
    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({"success": True})

@app.route("/appointments/<int:patient_id>", methods=["GET"])
def get_patient_appointments(patient_id):
    appointments = Appointment.query.filter_by(patient_id=patient_id, finished=False).all()
    appointment_list = [
        {
            "appointment_id": appt.appointment_id,
            "physician_id": appt.physician_id,
            "physician_name": appt.physician.name,
            "physician_specialty": appt.physician.specialty,
            "date": appt.date,
            "time": appt.time
        }
        for appt in appointments
    ]
    return jsonify(appointment_list)

@app.route("/appointments/doctor/<int:doctor_id>/<int:finished>", methods=["GET"])
def get_doctor_appointments(doctor_id, finished):
    # Convert 0/1 into a proper boolean
    finished = bool(finished)  

    appointments = Appointment.query.filter_by(physician_id=doctor_id, finished=finished).all()
    appointment_list = [
        {
            "appointment_id": appt.appointment_id,
            "patient_id": appt.patient_id,
            "patient_name": appt.patient.name,  # Access patient's name from the relationship
            "date": appt.date,
            "time": appt.time
        }
        for appt in appointments
    ]
    return jsonify(appointment_list)

@app.route("/edit-appointment/<int:appointment_id>", methods=["PUT"])
def edit_appointment(appointment_id):
    data = request.get_json()
    appointment = Appointment.query.get(appointment_id)

    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404

    # Use the current values as fallback
    new_physician_id = data.get("physician_id", appointment.physician_id)
    new_date = data.get("date", appointment.date)
    new_time = data.get("time", appointment.time)

    # Check for conflicts (exclude current appointment from the check)
    conflict = Appointment.query.filter(
        Appointment.appointment_id != appointment_id,
        Appointment.physician_id == new_physician_id,
        Appointment.date == new_date,
        Appointment.time == new_time
    ).first()

    if conflict:
        return jsonify({"error": "This time slot is already booked for the physician."}), 409

    # Apply changes only if provided
    if "physician_id" in data and data["physician_id"]:
        appointment.physician_id = data["physician_id"]
    if "date" in data and data["date"]:
        appointment.date = data["date"]
    if "time" in data and data["time"]:
        appointment.time = data["time"]

    db.session.commit()
    return jsonify({"success": True, "message": "Appointment updated successfully!"})

@app.route("/finish-appointment/<int:appointment_id>", methods=["PUT"])
def finish_appointment(appointment_id):
    # Get the appointment from the database
    appointment = Appointment.query.get(appointment_id)
    
    # Check if the appointment exists
    if appointment:
        # Get the diagnosis and treatment from the request
        data = request.get_json()
        diagnosis = data.get('diagnosis')
        treatment = data.get('treatment')
        
        # Validate that both diagnosis and treatment are provided
        if not diagnosis or not treatment:
            return jsonify({"success": False, "error": "Diagnosis and treatment are required"})
        
        # Update the appointment with the diagnosis and treatment
        appointment.finished = True
        appointment.diagnosis = diagnosis  
        appointment.treatment = treatment 
        
        # Commit the changes to the database
        db.session.commit()
        
        # Return success response
        return jsonify({"success": True})
    
    # If the appointment wasn't found, return an error
    return jsonify({"success": False, "error": "Appointment not found"})

@app.route("/prescribe", methods=["POST"])
def prescribe_medication():
    data = request.json
    appointment_id = data.get("appointment_id")
    drug_name = data.get("drug_name")
    quantity = data.get("quantity")
    frequency = data.get("frequency")
    price = data.get("price")

    # Check if drug exists
    drug = MedicationInventory.query.filter_by(drug_name=drug_name).first()
    if not drug:
        return jsonify({"error": "Drug not in inventory"}), 400

    # Check if stock is sufficient
    if drug.stock_quantity < int(quantity):
        return jsonify({"error": "Not enough stock available"}), 400

    # Insert prescription
    new_prescription = Prescription(
        appointment_id=appointment_id,
        drug_id=drug.drug_id,
        quantity=quantity,
        frequency=frequency,
        price=price
    )
    db.session.add(new_prescription)

    # Update inventory
    drug.stock_quantity -= int(quantity)
    db.session.commit()

    return jsonify({"message": "Prescription added successfully"}), 201

@app.route("/delete-appointment/<int:appointment_id>", methods=["DELETE"])
def delete_appointment(appointment_id):
    appointment = Appointment.query.get(appointment_id)
    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404

    db.session.delete(appointment)
    db.session.commit()
    
    return jsonify({"success": True, "message": "Appointment deleted successfully"}), 200

@app.route("/appointments/finished/<int:patient_id>", methods=["GET"])
def get_finished_appointments(patient_id):
    doctor = request.args.get('doctor')
    specialty = request.args.get('specialty')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    start_time = request.args.get('start_time')
    end_time = request.args.get('end_time')

    # Start with all finished appointments for the patient
    query = Appointment.query.filter_by(patient_id=patient_id, finished=True)

    # Apply filters only if they're present
    if doctor:
        query = query.filter(Appointment.physician_id == doctor)
    if specialty:
        query = query.join(Physician).filter(Physician.specialty == specialty)
    if start_date:
        query = query.filter(Appointment.date >= start_date)
    if end_date:
        query = query.filter(Appointment.date <= end_date)
    if start_time:
        query = query.filter(Appointment.time >= start_time)
    if end_time:
        query = query.filter(Appointment.time <= end_time)

    appointments = query.all()

    appointment_list = []
    for appt in appointments:
        prescriptions = [
            {
                "name": p.medication.drug_name,
                "quantity": p.quantity,
                "frequency": p.frequency,
                "price": float(p.price)  
            }
            for p in appt.prescriptions
        ]

        appointment_list.append({
            "appointment_id": appt.appointment_id,
            "physician_id": appt.physician_id,
            "physician_name": appt.physician.name,
            "physician_specialty": appt.physician.specialty,
            "date": appt.date,  # Leave date as string (no need for strftime)
            "time": appt.time,
            "diagnosis": appt.diagnosis,
            "treatment": appt.treatment,
            "prescriptions": prescriptions
        })

    return jsonify(appointment_list)


@app.route("/appointments/finished/doctor/<int:doctor_id>")
def get_finished_appointments_by_doctor(doctor_id):
    # Optional query parameters
    patient_id = request.args.get("patient")
    age_range = request.args.get("age_range")
    blood_type = request.args.get("blood_type")
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    start_time = request.args.get("start_time")
    end_time = request.args.get("end_time")

    query = Appointment.query.filter_by(physician_id=doctor_id, finished=True)

    # Flag to track if we need to join Patient table
    joined_patient = False

    if patient_id:
        query = query.filter(Appointment.patient_id == patient_id)

    if age_range or blood_type:  # Only join if we are filtering by age or blood type
        query = query.join(Patient)
        joined_patient = True

    if age_range:
        if age_range == "0-18":
            age_min, age_max = 0, 18
        elif age_range == "19-35":
            age_min, age_max = 19, 35
        elif age_range == "36-50":
            age_min, age_max = 36, 50
        elif age_range == "51+":
            age_min, age_max = 51, 200
        else:
            age_min, age_max = 0, 200  # fallback if invalid input
        query = query.filter(Patient.age >= age_min, Patient.age <= age_max)

    if blood_type:
        query = query.filter(Patient.blood_type == blood_type)

    if start_date:
        query = query.filter(Appointment.date >= start_date)
    if end_date:
        query = query.filter(Appointment.date <= end_date)
    if start_time:
        query = query.filter(Appointment.time >= start_time)
    if end_time:
        query = query.filter(Appointment.time <= end_time)

    appointments = query.all()
    result = []
    for appt in appointments:
        result.append({
            "appointment_id": appt.appointment_id,
            "patient_name": appt.patient.name,
            "patient_age": appt.patient.age,
            "blood_type": appt.patient.blood_type,
            "date": appt.date,
            "time": appt.time,
            "diagnosis": appt.diagnosis,
            "treatment": appt.treatment,
            "prescriptions": [
                {
                    "name": presc.medication.drug_name,
                    "quantity": presc.quantity,
                    "frequency": presc.frequency,
                    "price": float(presc.price)
                }
                for presc in appt.prescriptions
            ]
        })

    return jsonify(result)

if __name__ == '__main__':
    with app.app_context():  
        db.create_all()  # Ensure database is created
    app.run(debug=True)
