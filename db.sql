CREATE TABLE "user"(
    _id uuid DEFAULT uuid_generate_v4 (),
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    middle_name varchar(255),
    email varchar(255) UNIQUE NOT NULL,
    isEmailVerified bool NOT NULL DEFAULT false,
    ismobileverified bool NOT NULL DEFAULT false,
    emailVerificationToken uuid DEFAULT uuid_generate_v4 (),
    password varchar(255) NOT NULL,
    forgotPasswordToken uuid,
    qrsecret varchar(255),
    qrVerificationtoken uuid,
    phone varchar(255) NOT NULL,
	changeNumberCode varchar(255),
    profile_photo varchar(255),
    address1 varchar(255),
    address2 varchar(255),
    city varchar(255),
	country varchar(255) NOT NULL,
    postal_code varchar(255),
    gender varchar(255),
    date_of_birth varchar(255) NOT NULL,
    authenticator_type varchar(255),
    roles text[],
    two_fa_backup text[],
    scopes text[],
    wallet_email varchar(255) DEFAULT '',
    company_registered_no varchar(255),
    KYC_status varchar(255) DEFAULT 'incomplete',
    user_sign uuid DEFAULT NULL,
    account_status varchar(255) DEFAULT 'disabled',
    timestamps TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "kycdocuments"(
    userId uuid NOT NULL,
    id1_type varchar(255) NOT NULL,
    id1_number varchar(255) NOT NULL,
    id1_expiry varchar(255) NOT NULL,
    id1_frontSide varchar(255) NOT NULL,
    id2_type varchar(255) NOT NULL,
    id2_number varchar(255) NOT NULL,
    id2_expiry varchar(255) NOT NULL,
    id1_backSide varchar(255) NOT NULL,
    id2_frontSide varchar(255) NOT NULL,
    id2_backSide varchar(255) NOT NULL,
    selfie varchar(255) NOT NULL,
    addressProof varchar(255) NOT NULL
);

CREATE TABLE "wallet"(
    userId uuid,
    walletType varchar(255),
    wallet_address varchar(255),
    sign varchar(255) NOT NULL
)