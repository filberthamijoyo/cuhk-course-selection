BEGIN;

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'C',
                73,
                2.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'MAT1001'
            AND c.semester = 'FALL'
            AND c.year = 2022
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                83,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CLC1201'
            AND c.semester = 'FALL'
            AND c.year = 2022
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'C+',
                77,
                2.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC1003'
            AND c.semester = 'FALL'
            AND c.year = 2022
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'C',
                73,
                2.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'ENG1001'
            AND c.semester = 'FALL'
            AND c.year = 2022
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'D+',
                67,
                1.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'MAT2041'
            AND c.semester = 'FALL'
            AND c.year = 2022
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B-',
                80,
                2.7,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'PED1001'
            AND c.semester = 'FALL'
            AND c.year = 2022
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B',
                83,
                3.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC1004'
            AND c.semester = 'SPRING'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'PA',
                NULL,
                NULL,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'DDA2001'
            AND c.semester = 'SPRING'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'C',
                73,
                2.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'ENG1002'
            AND c.semester = 'SPRING'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'C',
                73,
                2.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'MAT1002'
            AND c.semester = 'SPRING'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'A',
                92,
                4.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'PED1002'
            AND c.semester = 'SPRING'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B',
                83,
                3.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CLC1301'
            AND c.semester = 'FALL'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B',
                83,
                3.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC3001'
            AND c.semester = 'FALL'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B-',
                80,
                2.7,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC3002'
            AND c.semester = 'FALL'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'A-',
                88,
                3.7,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'ENG2001'
            AND c.semester = 'FALL'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                85,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'GEC3407'
            AND c.semester = 'FALL'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B',
                83,
                3.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'GFN1000'
            AND c.semester = 'FALL'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B-',
                80,
                2.7,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'PHY1001'
            AND c.semester = 'FALL'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                83,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'STA2001'
            AND c.semester = 'SUMMER'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'A-',
                88,
                3.7,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'GFH1000'
            AND c.semester = 'SPRING'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'PA',
                NULL,
                NULL,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'ITE1000'
            AND c.semester = 'SPRING'
            AND c.year = 2023
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                85,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC3100'
            AND c.semester = 'SPRING'
            AND c.year = 2024
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                85,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'ECE2050'
            AND c.semester = 'SPRING'
            AND c.year = 2024
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                85,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'ENG2002S'
            AND c.semester = 'SPRING'
            AND c.year = 2024
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                85,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'GED2119'
            AND c.semester = 'SPRING'
            AND c.year = 2024
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B',
                83,
                3.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'MAT3007'
            AND c.semester = 'SUMMER'
            AND c.year = 2024
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'A-',
                88,
                3.7,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC3050'
            AND c.semester = 'FALL'
            AND c.year = 2024
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'A',
                92,
                4.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC3150'
            AND c.semester = 'FALL'
            AND c.year = 2024
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                85,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'DDA3020'
            AND c.semester = 'FALL'
            AND c.year = 2024
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'A-',
                88,
                3.7,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'GEA2000'
            AND c.semester = 'FALL'
            AND c.year = 2024
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'A-',
                88,
                3.7,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC3180'
            AND c.semester = 'SPRING'
            AND c.year = 2025
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B',
                83,
                3.0,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC4001'
            AND c.semester = 'SPRING'
            AND c.year = 2025
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                85,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC4100'
            AND c.semester = 'SPRING'
            AND c.year = 2025
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                85,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'DDA4210'
            AND c.semester = 'SPRING'
            AND c.year = 2025
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, numeric_grade, grade_points, status, submitted_at, approved_at)
            SELECT 
                e.id,
                'B+',
                85,
                3.3,
                'PUBLISHED',
                CURRENT_TIMESTAMP,
                CURRENT_TIMESTAMP
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'DDA4220'
            AND c.semester = 'SPRING'
            AND c.year = 2025
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                numeric_grade = EXCLUDED.numeric_grade,
                grade_points = EXCLUDED.grade_points,
                status = 'PUBLISHED',
                approved_at = CURRENT_TIMESTAMP;
            

            INSERT INTO grades (enrollment_id, letter_grade, status)
            SELECT 
                e.id,
                'IP',
                'IN_PROGRESS'
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'AIE3901'
            AND c.semester = 'FALL'
            AND c.year = 2025
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                status = 'IN_PROGRESS';
            

            INSERT INTO grades (enrollment_id, letter_grade, status)
            SELECT 
                e.id,
                'IP',
                'IN_PROGRESS'
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'CSC3170'
            AND c.semester = 'FALL'
            AND c.year = 2025
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                status = 'IN_PROGRESS';
            

            INSERT INTO grades (enrollment_id, letter_grade, status)
            SELECT 
                e.id,
                'IP',
                'IN_PROGRESS'
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'DDA4100'
            AND c.semester = 'FALL'
            AND c.year = 2025
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                status = 'IN_PROGRESS';
            

            INSERT INTO grades (enrollment_id, letter_grade, status)
            SELECT 
                e.id,
                'IP',
                'IN_PROGRESS'
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'DDA4230'
            AND c.semester = 'FALL'
            AND c.year = 2025
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                status = 'IN_PROGRESS';
            

            INSERT INTO grades (enrollment_id, letter_grade, status)
            SELECT 
                e.id,
                'IP',
                'IN_PROGRESS'
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            WHERE e.user_id = 66
            AND c.course_code = 'STA4606'
            AND c.semester = 'FALL'
            AND c.year = 2025
            ON CONFLICT (enrollment_id) 
            DO UPDATE SET
                letter_grade = EXCLUDED.letter_grade,
                status = 'IN_PROGRESS';
            

        INSERT INTO transcripts (user_id, semester, year, gpa, term_gpa, total_credits, earned_credits, quality_points, academic_standing, generated_at)
        VALUES (
            66,
            'FALL',
            2022,
            2.212,
            2.212,
            16,
            16,
            35.40,
            'GOOD_STANDING',
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, semester, year)
        DO UPDATE SET
            gpa = EXCLUDED.gpa,
            term_gpa = EXCLUDED.term_gpa,
            total_credits = EXCLUDED.total_credits,
            earned_credits = EXCLUDED.earned_credits,
            quality_points = EXCLUDED.quality_points,
            academic_standing = EXCLUDED.academic_standing;
        

        INSERT INTO transcripts (user_id, semester, year, gpa, term_gpa, total_credits, earned_credits, quality_points, academic_standing, generated_at)
        VALUES (
            66,
            'FALL',
            2023,
            2.692,
            3.057,
            37,
            37,
            99.60,
            'GOOD_STANDING',
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, semester, year)
        DO UPDATE SET
            gpa = EXCLUDED.gpa,
            term_gpa = EXCLUDED.term_gpa,
            total_credits = EXCLUDED.total_credits,
            earned_credits = EXCLUDED.earned_credits,
            quality_points = EXCLUDED.quality_points,
            academic_standing = EXCLUDED.academic_standing;
        

        INSERT INTO transcripts (user_id, semester, year, gpa, term_gpa, total_credits, earned_credits, quality_points, academic_standing, generated_at)
        VALUES (
            66,
            'SPRING',
            2023,
            2.494,
            2.007,
            52,
            52,
            129.70,
            'GOOD_STANDING',
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, semester, year)
        DO UPDATE SET
            gpa = EXCLUDED.gpa,
            term_gpa = EXCLUDED.term_gpa,
            total_credits = EXCLUDED.total_credits,
            earned_credits = EXCLUDED.earned_credits,
            quality_points = EXCLUDED.quality_points,
            academic_standing = EXCLUDED.academic_standing;
        

        INSERT INTO transcripts (user_id, semester, year, gpa, term_gpa, total_credits, earned_credits, quality_points, academic_standing, generated_at)
        VALUES (
            66,
            'SUMMER',
            2023,
            2.538,
            3.300,
            55,
            55,
            139.60,
            'GOOD_STANDING',
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, semester, year)
        DO UPDATE SET
            gpa = EXCLUDED.gpa,
            term_gpa = EXCLUDED.term_gpa,
            total_credits = EXCLUDED.total_credits,
            earned_credits = EXCLUDED.earned_credits,
            quality_points = EXCLUDED.quality_points,
            academic_standing = EXCLUDED.academic_standing;
        

        INSERT INTO transcripts (user_id, semester, year, gpa, term_gpa, total_credits, earned_credits, quality_points, academic_standing, generated_at)
        VALUES (
            66,
            'FALL',
            2024,
            2.742,
            3.675,
            67,
            67,
            183.70,
            'GOOD_STANDING',
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, semester, year)
        DO UPDATE SET
            gpa = EXCLUDED.gpa,
            term_gpa = EXCLUDED.term_gpa,
            total_credits = EXCLUDED.total_credits,
            earned_credits = EXCLUDED.earned_credits,
            quality_points = EXCLUDED.quality_points,
            academic_standing = EXCLUDED.academic_standing;
        

        INSERT INTO transcripts (user_id, semester, year, gpa, term_gpa, total_credits, earned_credits, quality_points, academic_standing, generated_at)
        VALUES (
            66,
            'SPRING',
            2024,
            2.827,
            3.300,
            79,
            79,
            223.30,
            'GOOD_STANDING',
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, semester, year)
        DO UPDATE SET
            gpa = EXCLUDED.gpa,
            term_gpa = EXCLUDED.term_gpa,
            total_credits = EXCLUDED.total_credits,
            earned_credits = EXCLUDED.earned_credits,
            quality_points = EXCLUDED.quality_points,
            academic_standing = EXCLUDED.academic_standing;
        

        INSERT INTO transcripts (user_id, semester, year, gpa, term_gpa, total_credits, earned_credits, quality_points, academic_standing, generated_at)
        VALUES (
            66,
            'SUMMER',
            2024,
            2.833,
            3.000,
            82,
            82,
            232.30,
            'GOOD_STANDING',
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, semester, year)
        DO UPDATE SET
            gpa = EXCLUDED.gpa,
            term_gpa = EXCLUDED.term_gpa,
            total_credits = EXCLUDED.total_credits,
            earned_credits = EXCLUDED.earned_credits,
            quality_points = EXCLUDED.quality_points,
            academic_standing = EXCLUDED.academic_standing;
        

        INSERT INTO transcripts (user_id, semester, year, gpa, term_gpa, total_credits, earned_credits, quality_points, academic_standing, generated_at)
        VALUES (
            66,
            'FALL',
            2025,
            2.833,
            0.000,
            82,
            82,
            232.30,
            'GOOD_STANDING',
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, semester, year)
        DO UPDATE SET
            gpa = EXCLUDED.gpa,
            term_gpa = EXCLUDED.term_gpa,
            total_credits = EXCLUDED.total_credits,
            earned_credits = EXCLUDED.earned_credits,
            quality_points = EXCLUDED.quality_points,
            academic_standing = EXCLUDED.academic_standing;
        

        INSERT INTO transcripts (user_id, semester, year, gpa, term_gpa, total_credits, earned_credits, quality_points, academic_standing, generated_at)
        VALUES (
            66,
            'SPRING',
            2025,
            2.908,
            3.320,
            97,
            97,
            282.10,
            'GOOD_STANDING',
            CURRENT_TIMESTAMP
        )
        ON CONFLICT (user_id, semester, year)
        DO UPDATE SET
            gpa = EXCLUDED.gpa,
            term_gpa = EXCLUDED.term_gpa,
            total_credits = EXCLUDED.total_credits,
            earned_credits = EXCLUDED.earned_credits,
            quality_points = EXCLUDED.quality_points,
            academic_standing = EXCLUDED.academic_standing;
        
COMMIT;