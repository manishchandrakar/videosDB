import { z } from 'zod'

import { fileValidator, imageFileValidator } from './utils'

import {
	regexPhoneNumber,
	regexAadharNumber,
	regexName,
	regexAreaPinCode,
	regexPANCardNumber,
	experienceRegex,
	regexBankIfcCode,
	regexVehicleNumber,
	password
} from '@/constants/regex'
import {
	AddressTypesEnum,
	AdvertisingBannerPositionEnum,
	InputTypeEnum,
	ServiceCartEnum,
	VehicleFuelTypeEnum
} from '@/types/enum'

export const nonEmptyString = (fieldName: string) => z.string().min(1, `${fieldName} is required`)

export const employeesSchema = z
	.object({
		firstName: z.string().regex(regexName, 'First name must contain only letters, spaces, hyphens, or apostrophes'),

		middleName: z
			.string()
			.regex(regexName, 'Middle name must contain only letters, spaces, hyphens, or apostrophes')
			.optional(),

		lastName: z.string().regex(regexName, 'Last name must contain only letters, spaces, hyphens, or apostrophes'),

		phone: z.string().regex(regexPhoneNumber, 'Invalid phone number'),
		alternatePhone: z.string().regex(regexPhoneNumber, 'Invalid phone number'),

		email: z.string().email('Invalid email address'),
		city: nonEmptyString('City'),
		district: nonEmptyString('district'),

		state: nonEmptyString('State'),
		gender: nonEmptyString('Gender'),

		description: nonEmptyString('Description'),

		pinCode: z.string().regex(regexAreaPinCode, 'Pin code must be exactly 6 digits and contain only numbers'),
		address: nonEmptyString('address'),
		landmark: nonEmptyString('landmark'),

		experience: z.string().regex(experienceRegex, 'Experience must be a whole number between 0 and 100'),

		aadharNumber: z.string().regex(regexAadharNumber, 'Aadhar must be exactly 12 digits'),

		panNumber: z.string().regex(regexPANCardNumber, 'Invalid PAN format'),

		drivingLicenseNumber: nonEmptyString('Driving license number'),

		bankName: nonEmptyString('Bank name'),
		bankAccount: nonEmptyString('Bank account number'),
		confirmBankAccount: nonEmptyString('Confirm bank account number'),
		bankPanNumber: nonEmptyString('Bank PAN number'),
		ifscCode: z.string().regex(regexBankIfcCode, 'Invalid IFSC Code'),
		branchAddress: nonEmptyString('Branch address'),

		bankDocs: imageFileValidator,
		adhaarbackDocs: imageFileValidator,
		adhaarfrontDocs: imageFileValidator,
		drivingDocs: imageFileValidator,
		panDocs: imageFileValidator,
		profilePic: imageFileValidator.optional()
	})
	.refine(data => data.bankAccount === data.confirmBankAccount, {
		message: 'Bank account numbers do not match',
		path: ['confirmBankAccount']
	})

export const employeeSchema = z.object({
	firstName: z.string().regex(regexName, 'First name must contain only letters, spaces, hyphens, or apostrophes'),
	/*	middleName: z
		.string()
		.regex(regexName, 'Middle name must contain only letters, spaces, hyphens, or apostrophes')
		.optional(), */
	lastName: z.string().regex(regexName, 'Last name must contain only letters, spaces, hyphens, or apostrophes'),
	phone: z.string().regex(regexPhoneNumber, 'Invalid phone number'),
	email: z.string().trim().email('Invalid email address').optional().or(z.literal('')).nullable(),

	password: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.regex(password, 'Password must contain uppercase, lowercase, number and special character')
		.optional(),

	//INFO:
	state: nonEmptyString('State'),
	//INFO:
	district: nonEmptyString('District'),
	cityId: nonEmptyString('City'),
	gender: nonEmptyString('Gender'),

	address: nonEmptyString('Address'),
	areaCode: z.string().regex(regexAreaPinCode, 'Pin code must be exactly 6 digits and contain only numbers'),
	landmark: nonEmptyString('Landmark'),
	workExperience: z
		.string({ required_error: 'Experience is required' })
		.min(0, 'Experience must be between 0 and 100')
		.max(100, 'Experience must be between 0 and 100'),

	aadharNumber: z.string().regex(regexAadharNumber, 'Aadhar must be exactly 12 digits'),
	dateOfBirth: nonEmptyString('dateOfBirth'),
	// INFO: panNumber: z.string().regex(regexPANCardNumber, 'Invalid PAN format'),
	// INFO:	// drivingLicenseNumber: nonEmptyString('Driving license number'),

	profilePic: imageFileValidator.optional(),
	//INFO: panDocs: imageFileValidator,
	//INFO: drivingDocs: imageFileValidator,
	adhaarfrontDocs: imageFileValidator,
	adhaarbackDocs: imageFileValidator
	// INFO: will add in future bankDocs: imageFileValidator
})

export const updateEmployeeSchema = z
	.object({
		firstName: z.string().regex(regexName, 'First name must contain only letters, spaces, hyphens, or apostrophes'),
		lastName: z.string().regex(regexName, 'Last name must contain only letters, spaces, hyphens, or apostrophes'),
		phone: z.string().optional(),

		email: z.string().email('Invalid email address'),

		state: nonEmptyString('State'),
		district: nonEmptyString('District'),
		cityId: nonEmptyString('City'),
		gender: nonEmptyString('Gender'),

		address: nonEmptyString('Address'),
		areaCode: z.string().regex(regexAreaPinCode, 'Pin code must be exactly 6 digits and contain only numbers'),
		landmark: nonEmptyString('Landmark'),
		workExperience: z
			.string({ required_error: 'Experience is required' })
			.min(0, 'Experience must be between 0 and 100')
			.max(100, 'Experience must be between 0 and 100'),

		aadharNumber: z.string().regex(regexAadharNumber, 'Aadhar must be exactly 12 digits'),
		dateOfBirth: nonEmptyString('dateOfBirth'),
		joiningDate: nonEmptyString('joiningDate'),

		profilePic: z.union([z.string(), z.instanceof(File)]).optional(),
		adhaarfrontDocs: z.union([z.string(), z.instanceof(File)]).optional(),
		adhaarbackDocs: z.union([z.string(), z.instanceof(File)]).optional()
	})
	.partial()

export const vehicleSchemaBrand = z.object({
	//INFO: It may be add in Future so not removing it just commenting */}

	//INFO:  vehicleType: z.string().min(1, 'Vehicle type is required'),
	//INFO: companyName: z.string().min(1, 'Company name is required'),
	vehicleBrand: z.string().min(1, 'Vehicle brand name is required'),
	companyLogo: z.string().optional()
})

export const serviceSchema = z.object({
	vehicleCategoryId: z.string().min(1, 'Vehicle category is required'),
	taxId: z.string().min(1, 'Tax is required'),
	serviceCategoryId: z.string().min(1, 'Service category is required'),
	title: z.string().min(1, 'Title is required'),
	amount: z.number().positive('Amount must be greater than 0'),
	estimatedDuration: z.number().positive('Estimated duration is required'),
	description: z.string().min(1, 'Description is required'),
	images: z.array(z.any()).min(1, 'At least one image is required'),
	imageLabels: z.array(z.object({ value: z.string() })).optional(),

	keyPoints: z.array(z.object({ value: z.string() })).optional()
})

export const categorySchema = z.object({
	image: z.string().optional(),
	categoryName: z.string().min(1, 'Category name is required'),
	description: z.string().min(5, 'Category description is required').max(500, 'Category description is too long'),
	isActive: z.boolean()
})

export const serviceCategorySchema = z.object({
	image: z.any().optional(),
	title: z.string().min(2, 'Category title is required'),
	description: z.string().min(5, 'Category description is required').max(500, 'Category description is too long')
})

export const billingSchema = z.object({
	billingName: z.string().min(1, 'Billing name is required'),
	billingPhone: z.string().max(10, 'Phone number is required').regex(regexPhoneNumber, 'Invalid phone number'),
	billingAddress: z.string().min(1, 'Billing address is required'),
	billingAreaCode: z.string().regex(regexAreaPinCode, 'Pin code must be exactly 6 digits and contain only numbers'),
	billingCityId: nonEmptyString('billingCityId')
})
export const serviceImageUpdateSchema = z.object({
	images: z.array(z.instanceof(File)).min(1, 'At least one image file is required').optional().nullable(),
	thumbnail: z.instanceof(File, { message: 'Thumbnail file must be a file' }).optional().nullable()
})

export const serviceUpdateSchema = z.object({
	vehicleCategoryId: z.string().min(1, 'Vehicle category is required'),
	taxId: z.string().min(1, 'Tax is required'),
	serviceCategoryId: z.string().min(1, 'Service category is required'),
	title: z.string().min(1, 'Title is required'),
	amount: z.number().positive('Amount must be greater than 0'),
	estimatedDuration: z.number().positive('Estimated duration is required'),
	description: z.string().min(1, 'Description is required'),
	imageLabels: z.array(z.object({ value: z.string() })).optional(),

	keyPoints: z.array(z.object({ value: z.string() })).optional()
})

// INFO: Add On Services Schema
export const addOnServiceSchema = z.object({
	taxId: z.string().min(1, 'Tax ID is required'),
	title: z.string().min(2, 'Title must be at least 2 characters'),
	//INFO: image: z.instanceof(File, { message: 'Image is required' }).or(z.string().url().optional()),
	image: fileValidator,

	description: z.string().min(1, 'Description is required'),
	amount: z.number({ invalid_type_error: 'Amount must be a number' }).positive('Amount must be greater than 0')
})

export const addOnServiceUpdateSchema = z.object({
	taxId: z.string().min(1, 'Tax ID is required'),
	title: z.string().min(2, 'Title must be at least 2 characters'),
	//INFO: image: z.instanceof(File, { message: 'Image is required' }).or(z.string().url().optional()),
	image: fileValidator.optional(),

	description: z.string().min(1, 'Description is required'),
	amount: z.number({ invalid_type_error: 'Amount must be a number' }).positive('Amount must be greater than 0')
})

export const VehicleModelSchema = z.object({
	vehicleBrand: z.string().optional(),
	companyLogo: z.string().optional(),
	vehicleCategoryId: z.string().min(1, 'Vehicle category is required'),
	vehicleBrandId: z.string().min(1, 'Vehicle brand is required')
})
//INFO: Booking Schema

export const AddBookingSchema = z.object({
	customerId: z.string().min(1, 'Customer is required').nullable().optional(),

	billingName: z.string().min(1, 'Billing name is required'),
	billingPhone: z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long'),
	billingAreaCode: z.string().min(1, 'Billing area code is required'),
	billingAddress: z.string().min(1, 'Billing address is required'),
	isCashOnBooking: z.boolean()
})

export const customerSchema = z.object({
	photo: fileValidator.optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	phone: z.string().regex(regexPhoneNumber, 'Invalid phone number'),
	email: z.string().optional()
})

export const productSchema = z.object({
	taxId: z.string().min(1, 'Tax is required'),
	title: z.string().min(2, 'Title is required'),
	amount: z.number().positive('Amount must be greater than 0'),
	availableStock: z.number().positive('Amount must be greater than 0'),
	description: z.string().min(5, 'Description is required'),
	image: z.custom<File>(val => val instanceof File, {
		message: 'A valid file is required'
	})
})

export const productUpdateSchema = z.object({
	taxId: z.string().min(1, 'Tax is required'),
	title: z.string().min(2, 'Title is required'),
	amount: z.number().positive('Amount must be greater than 0'),
	availableStock: z.number().positive('Amount must be greater than 0'),
	description: z.string().min(5, 'Description is required'),
	images: z.array(z.instanceof(File)).min(1, 'At least one image is required')
})

//INFO: Service Fees
export const serviceFeesSchema = z.object({
	visitingCharge: z
		.number({ invalid_type_error: 'Visiting Charge must be a number' })
		.min(0, 'Visiting Charge cannot be negative'),
	visitingTaxPercent: z
		.number({ invalid_type_error: 'Visiting Tax Percent must be a number' })
		.min(0, 'Tax percent cannot be negative')
		.max(100, 'Tax percent cannot exceed 100'),
	cancellationConvenienceFee: z
		.number({ invalid_type_error: 'Cancellation Fee must be a number' })
		.min(0, 'Fee cannot be negative'),
	rescheduleConvenienceFee: z
		.number({ invalid_type_error: 'Reschedule Fee must be a number' })
		.min(0, 'Fee cannot be negative'),
	refundBusinessDays: z.string().regex(/^\d+-\d+$/, 'Refund business days must be in format X-Y')
})

//INFO: Master
export const addStateSchema = z.object({
	stateName: z.string().min(2, 'StateName is required')
})

export const addDistrictSchema = z.object({
	districtName: z.string().min(2, 'District Name is required'),
	stateId: z.string().min(1, 'State is required')
})

export const addCitySchema = z.object({
	cityName: z.string().min(2, 'City Name is required'),
	stateId: z.string().min(1, 'State is required'),
	districtId: z.string().min(1, 'State is required')
})

//INFO: Banners
export const addBannerSchema = z.object({
	image: fileValidator.optional(),
	title: z.string().max(100, 'Title must be at most 100 characters').optional(),
	description: z.string().max(500, 'Description must be at most 500 characters').optional(),
	redirectUrl: z.string().optional(),
	videoUrl: z.string().url().optional().nullable(),

	serviceId: z.string().optional(),
	productId: z.string().optional(),
	position: z.nativeEnum(AdvertisingBannerPositionEnum).optional(),
	priorityOrder: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional()
})

const InputTypeEnumSchema = z.nativeEnum(InputTypeEnum)

export const checkListSchema = z.object({
	title: z.string({ required_error: 'Title is required' }).min(1, 'Title cannot be empty'),

	description: z.string({ required_error: 'Description is required' }).min(1, 'Description cannot be empty'),

	formData: z
		.array(
			z.object({
				sectionTitle: z.string({ required_error: 'Section title is required' }).min(1, 'Section title cannot be empty'),

				questions: z
					.array(
						z.object({
							label: z.string({ required_error: 'Label is required' }).min(1, 'Label cannot be empty'),

							inputType: InputTypeEnumSchema,

							options: z.array(z.string().min(1, 'Option cannot be empty')).optional(),

							isRequired: z.boolean({
								required_error: 'isRequired must be a boolean'
							})
						})
					)
					.min(1, 'At least one question is required')
			})
		)
		.min(1, 'At least one section is required'),

	isActive: z.boolean({
		required_error: 'isActive must be a boolean'
	})
})

export const testimonialSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	profileImageUrl: z
		.union([z.instanceof(File), z.string()])
		.optional()
		.nullable(),
	designation: z.string().optional(),
	rating: z
		.number({ invalid_type_error: 'Rating must be a number' })
		.min(1, 'Minimum rating is 1')
		.max(5, 'Maximum rating is 5'),
	message: z.string().optional(),
	priorityOrder: z.number().optional(),
	isFeatured: z.boolean().optional()
})

//INFO: AreaCode

export const areaCodeSchema = z.object({
	state: z.string().nonempty('State is required'),
	district: z.string().nonempty('District is required'),
	city: z.union([z.string(), z.number()]).refine(val => val !== null, {
		message: 'City is required'
	}),
	areaCodeName: z.string().min(2, 'Area Code Name must be at least 2 characters'),
	areaCode: z.string().regex(/^\d+$/, 'Area Code must be numeric')
})
export const createCustomerCartSchema = z.object({
	itemId: z.string().nonempty('Item ID is required'),
	type: z.enum([ServiceCartEnum.SERVICE, ServiceCartEnum.PRODUCT])
})

export const addressSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	phone: z.string().min(10, 'Phone number is required'),
	areaCode: z.string().min(1, 'Area code is required'),
	cityId: z.string().min(1, 'City ID is required'),
	stateId: z.string().min(1, 'State ID is required'),
	districtId: z.string().min(1, 'DistrictID is required'),

	address: z.string().min(1, 'Address is required'),
	landmark: z.string().min(1, 'Landmark is required'),
	type: z.enum([AddressTypesEnum.HOME, AddressTypesEnum.WORK, AddressTypesEnum.OTHER]),
	//INFO: latitude: z.string().optional(),
	//INFO: longitude: z.string().optional(),
	isDefault: z.boolean().optional()
})

export const vehicleSchema = z.object({
	vehicleModelId: z.string().min(1, 'Vehicle Model is required'),
	registrationNumber: z.string().regex(regexVehicleNumber, 'Invalid vehicle number').optional(),
	manufactureDate: z.string().optional(),
	fuelType: z.enum(
		[
			VehicleFuelTypeEnum.PETROL,
			VehicleFuelTypeEnum.DIESEL,
			VehicleFuelTypeEnum.CNG,
			VehicleFuelTypeEnum.ELECTRIC,
			VehicleFuelTypeEnum.HYBRID,
			VehicleFuelTypeEnum.LPG
		],
		{
			required_error: 'Fuel Type is required'
		}
	),
	color: z.string().optional(),
	carSegment: z.string().optional(),
	odometerReading: z.number().optional(),
	insuranceExpiry: z.string().optional(),
	pucExpiry: z.string().optional(),
	lastServiceDate: z.string().optional(),
	isDefault: z.boolean().optional()
})

export const uploadPhotoSchema = z.object({
	photo: z
		.instanceof(File, { message: 'Photo is required' })
		.refine(file => file.size <= 5 * 1024 * 1024, {
			message: 'Max file size is 5MB'
		})
		.refine(file => file.type.startsWith('image/'), {
			message: 'Only image files are allowed'
		})
})

//INFO: Checklist Submission Schema
export const vehicleOwnerSubmissionSchema = z.object({
	name: z.string().min(1, 'Owner name is required'),
	phone: z.string().regex(regexPhoneNumber, 'Invalid phone number'),
	address: z.string().min(1, 'Address is required')
})

export const vehicleDetailSubmissionSchema = z.object({
	registrationNumber: z.string().min(1, 'Registration number is required'),
	vehicleModel: z.string().min(1, 'Vehicle model is required'),
	vehicleCategory: z.string().min(1, 'Vehicle category is required'),
	vehicleBrand: z.string().min(1, 'Vehicle brand is required'),
	manufactureDate: z.string().optional(),

	fuelType: z.string().min(1, 'Fuel type is required').nullable(),
	color: z.string().nullable().optional(),

	odometerReading: z.string().nullable().optional(),

	insuranceExpiry: z.string().nullable().optional(),
	pucExpiry: z.string().nullable().optional(),
	lastServiceDate: z.string().nullable().optional(),
	lastServiceKms: z.string().nullable().optional(),
	carSegment: z.string().nullable().optional()
})
/*
const createQuestionSchema = (isRequired: boolean) => {
	return z.object({
		questionId: z.string(),
		label: z.string(),
		inputType: z.string(),
		options: z.array(z.string()).nullable(),
		isRequired: z.boolean(),
		answer: isRequired ? z.string().min(1, 'This field is required') : z.string()
	})
}
*/

const optionalString = z.string().optional()
const optionalBoolean = z.boolean().optional()

const questionSchema = z.object({
	questionId: optionalString,
	label: optionalString,
	inputType: optionalString,
	options: z.array(z.string()).nullable().optional(),
	isRequired: optionalBoolean,
	answer: z.string().nullable().optional()
})

const formSectionSchema = z.object({
	sectionId: optionalString,
	sectionTitle: optionalString,
	questions: z.array(questionSchema).optional()
})

export const inspectionChecklistSubmissionSchema = z.object({
	checkListData: z
		.object({
			checklistId: optionalString,
			title: optionalString,
			vehicleOwnerData: vehicleOwnerSubmissionSchema.optional(),
			vehicleData: vehicleDetailSubmissionSchema.optional(),
			formData: z.array(formSectionSchema).optional()
		})
		.optional()
})
