const bcrypt = require('bcrypt');
const fs = require('fs').promises;

console.log('Script started...'); // Debugging

// Full list of users with their email and password
const users = [
  { email: 'alice.johnson@gmail.com', password: 'Alice@2025' },
  { email: 'bob.smith@yahoo.com', password: 'SecurePass123' },
  { email: 'charlie.brown@outlook.com', password: 'Charlie@456' },
  { email: 'diana.prince@gmail.com', password: 'WonderWoman99' },
  { email: 'edward.wilson@yahoo.com', password: 'Wilson!789' },
  { email: 'fiona.adams@outlook.com', password: 'Fiona#Pass' },
  { email: 'george.miller@gmail.com', password: 'MillerSecure1' },
  { email: 'hannah.white@yahoo.com', password: 'Hannah_2024' },
  { email: 'ian.carter@outlook.com', password: 'Ian!Secure#23' },
  { email: 'julia.roberts@gmail.com', password: 'Julia#Movies99' },
  { email: 'kevin.thompson@yahoo.com', password: 'Kevin@Secure77' },
  { email: 'lily.anderson@outlook.com', password: 'Anderson_Lily88' },
  { email: 'michael.harris@gmail.com', password: 'HarrisSecurePass' },
  { email: 'natalie.green@yahoo.com', password: 'Green@Password123' },
  { email: 'oliver.scott@outlook.com', password: 'ScottSecurePass' },
  { email: 'paula.young@gmail.com', password: 'Young#Secure777' },
  { email: 'quinn.foster@yahoo.com', password: 'Foster!2024' },
  { email: 'ryan.edwards@outlook.com', password: 'Ryan_Pass2025' },
  { email: 'sophia.king@gmail.com', password: 'King!SecurePass' },
  { email: 'travis.moore@yahoo.com', password: 'Moore@StrongPass' },
  { email: 'uma.walker@outlook.com', password: 'WalkerPass_99' },
  { email: 'victor.turner@gmail.com', password: 'Turner!Pass123' },
  { email: 'wendy.hall@yahoo.com', password: 'Hall_SecurePass2025' },
  { email: 'xavier.reed@outlook.com', password: 'Reed#XavierSecure' },
  { email: 'yasmine.bell@gmail.com', password: 'Bell!Secure88' },
  { email: 'zachary.carter@yahoo.com', password: 'Carter_Pass99' },
  { email: 'aaron.mitchell@outlook.com', password: 'Mitchell#Secure123' },
  { email: 'bethany.parker@gmail.com', password: 'Parker@SafePass' },
  { email: 'caleb.collins@yahoo.com', password: 'Collins_Pass456' },
  { email: 'daisy.scott@outlook.com', password: 'ScottSecure!Pass' },
  { email: 'ethan.hayes@gmail.com', password: 'Hayes#Strong2025' },
  { email: 'felicity.morgan@yahoo.com', password: 'MorganSecure_77' },
  { email: 'gregory.bennett@outlook.com', password: 'Bennett!SecurePass' },
  { email: 'holly.james@gmail.com', password: 'James_SafePass99' },
  { email: 'isaac.rogers@yahoo.com', password: 'Rogers#Secure123' },
  { email: 'jasmine.brooks@outlook.com', password: 'Brooks_PassSecure' },
  { email: 'kyle.adams@gmail.com', password: 'AdamsSecure#77' },
  { email: 'laura.simmons@yahoo.com', password: 'Simmons!Pass2025' },
  { email: 'marcus.peterson@outlook.com', password: 'Peterson#Strong88' },
  { email: 'nina.cooper@gmail.com', password: 'CooperSecure_99' },
  { email: 'oscar.mitchell@yahoo.com', password: 'Mitchell!PassSecure' },
  { email: 'penelope.gray@outlook.com', password: 'Gray#SafePass' },
  { email: 'quentin.ross@gmail.com', password: 'Ross_SecurePass2024' },
  { email: 'rachel.foster@yahoo.com', password: 'Foster!Secure77' },
  { email: 'samuel.jenkins@outlook.com', password: 'Jenkins_Safe123' },
  { email: 'tessa.lane@gmail.com', password: 'Lane#StrongPass' },
  { email: 'ulysses.carter@yahoo.com', password: 'Carter_PassSafe99' },
  { email: 'vanessa.howard@outlook.com', password: 'Howard!Secure2025' },
  { email: 'william.bennett@gmail.com', password: 'Bennett_Safe#77' },
  { email: 'xena.morris@yahoo.com', password: 'Morris_PassSecure' },
  { email: 'yosef.walker@outlook.com', password: 'WalkerSecure#Pass' },
  { email: 'zoe.richardson@gmail.com', password: 'Richardson_Safe123' },
  { email: 'adam.clarke@yahoo.com', password: 'Clarke_PassSecure77' },
  { email: 'bella.turner@outlook.com', password: 'Turner!SafePass' },
  { email: 'christopher.hughes@gmail.com', password: 'HughesSecure_99' },
  { email: 'danielle.owens@yahoo.com', password: 'Owens_PassSafe2025' },
  { email: 'eli.warren@outlook.com', password: 'Warren#SecurePass' },
  { email: 'felicity.ryan@gmail.com', password: 'RyanSafe_Pass123' },
  { email: 'george.hudson@yahoo.com', password: 'Hudson_SecurePass2024' }
];

async function hashPasswords() {
  console.log('Starting password hashing...'); // Debugging
  const hashedUsers = [];

  for (const user of users) {
    try {
      console.log(`Hashing password for: ${user.email}`); // Debugging
      const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password
      console.log('Hashed password:', hashedPassword); // Debugging
      hashedUsers.push({ email: user.email, password: hashedPassword }); // Store hashed password
    } catch (err) {
      console.error(`Error hashing password for ${user.email}:`, err);
    }
  }

  // Save hashed passwords to password.json
  console.log('Writing hashed passwords to password.json...'); // Debugging
  await fs.writeFile('password.json', JSON.stringify({ users: hashedUsers }, null, 2))
    .then(() => console.log('✅ password.json updated successfully!'))
    .catch(err => console.error('❌ Error writing to password.json:', err));
}

// Run the script
hashPasswords().catch(console.error);
