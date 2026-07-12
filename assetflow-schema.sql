CREATE TABLE `departments` (
  `id` uuid PRIMARY KEY,
  `name` varchar(255),
  `code` varchar(255) UNIQUE,
  `parent_department_id` uuid,
  `department_head_id` uuid,
  `status` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `users` (
  `id` uuid PRIMARY KEY,
  `name` varchar(255),
  `email` varchar(255) UNIQUE,
  `password_hash` varchar(255),
  `role` varchar(255),
  `status` varchar(255),
  `department_id` uuid,
  `phone_number` varchar(255),
  `timezone` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `locations` (
  `id` uuid PRIMARY KEY,
  `name` varchar(255),
  `code` varchar(255) UNIQUE,
  `parent_location_id` uuid,
  `type` varchar(255),
  `status` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `vendors` (
  `id` uuid PRIMARY KEY,
  `name` varchar(255),
  `contact_name` varchar(255),
  `email` varchar(255),
  `phone` varchar(255),
  `support_details` text,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `categories` (
  `id` uuid PRIMARY KEY,
  `name` varchar(255),
  `code` varchar(255) UNIQUE,
  `custom_fields` jsonb,
  `status` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `assets` (
  `id` uuid PRIMARY KEY,
  `name` varchar(255),
  `asset_tag` varchar(255) UNIQUE,
  `serial_number` varchar(255) UNIQUE,
  `category_id` uuid,
  `vendor_id` uuid,
  `location_id` uuid,
  `parent_asset_id` uuid,
  `acquisition_date` date,
  `acquisition_cost` decimal,
  `condition` varchar(255),
  `is_shared_bookable` boolean,
  `requires_booking_approval` boolean,
  `status` varchar(255),
  `document_urls` jsonb,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `allocations` (
  `id` uuid PRIMARY KEY,
  `asset_id` uuid,
  `allocated_to_type` varchar(255),
  `employee_id` uuid,
  `department_id` uuid,
  `allocated_by_id` uuid,
  `expected_return_date` date,
  `actual_return_date` date,
  `return_condition` varchar(255),
  `return_notes` text,
  `status` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `transfer_requests` (
  `id` uuid PRIMARY KEY,
  `asset_id` uuid,
  `current_allocation_id` uuid,
  `requested_by_id` uuid,
  `target_type` varchar(255),
  `target_employee_id` uuid,
  `target_department_id` uuid,
  `reason` text,
  `status` varchar(255),
  `reviewed_by_id` uuid,
  `review_notes` text,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `resource_bookings` (
  `id` uuid PRIMARY KEY,
  `asset_id` uuid,
  `booked_by_id` uuid,
  `start_time` timestamp,
  `end_time` timestamp,
  `status` varchar(255),
  `approved_by_id` uuid,
  `approval_notes` text,
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `maintenance_requests` (
  `id` uuid PRIMARY KEY,
  `asset_id` uuid,
  `requested_by_id` uuid,
  `description` text,
  `priority` varchar(255),
  `status` varchar(255),
  `reviewed_by_id` uuid,
  `technician_id` uuid,
  `vendor_id` uuid,
  `cost` decimal,
  `resolution_notes` text,
  `photo_url` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `audit_cycles` (
  `id` uuid PRIMARY KEY,
  `name` varchar(255),
  `scope_type` varchar(255),
  `department_id` uuid,
  `location_id` uuid,
  `start_date` date,
  `end_date` date,
  `status` varchar(255),
  `created_at` timestamp,
  `updated_at` timestamp
);

CREATE TABLE `audit_auditors` (
  `id` uuid PRIMARY KEY,
  `audit_cycle_id` uuid,
  `user_id` uuid,
  `created_at` timestamp
);

CREATE TABLE `audit_results` (
  `id` uuid PRIMARY KEY,
  `audit_cycle_id` uuid,
  `asset_id` uuid,
  `auditor_id` uuid,
  `status` varchar(255),
  `notes` text,
  `checked_at` timestamp
);

CREATE TABLE `audit_discrepancies` (
  `id` uuid PRIMARY KEY,
  `audit_cycle_id` uuid,
  `asset_id` uuid,
  `description` text,
  `resolved` boolean,
  `resolved_at` timestamp,
  `resolved_by_id` uuid,
  `created_at` timestamp
);

CREATE TABLE `notifications` (
  `id` uuid PRIMARY KEY,
  `user_id` uuid,
  `title` varchar(255),
  `message` text,
  `type` varchar(255),
  `read` boolean,
  `created_at` timestamp
);

CREATE TABLE `audit_logs` (
  `id` uuid PRIMARY KEY,
  `user_id` uuid,
  `action` varchar(255),
  `target_table` varchar(255),
  `target_id` uuid,
  `details` jsonb,
  `created_at` timestamp
);
