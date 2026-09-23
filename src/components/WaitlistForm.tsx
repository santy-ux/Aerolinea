import React, { useState } from 'react';

interface FormState {
  name: string;
  email: string;
  airline: string;
}

interface FocusedState {
  name: boolean;
  email: boolean;
  airline: boolean;
}

interface TouchedState {
  name: boolean;
  email: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
}

export default function WaitlistForm() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    airline: '',
  });

  const [focused, setFocused] = useState<FocusedState>({
    name: false,
    email: false,
    airline: false,
  });

  const [touched, setTouched] = useState<TouchedState>({
    name: false,
    email: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [queueNumber, setQueueNumber] = useState<number>(1284);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  const validateField = (field: 'name' | 'email', value: string): string | undefined => {
    if (field === 'name') {
      if (!value.trim()) {
        return 'Por favor, ingresa tu nombre completo.';
      }
      if (value.trim().length < 2) {
        return 'El nombre debe tener al menos 2 caracteres.';
      }
    }
    if (field === 'email') {
      if (!value.trim()) {
        return 'Por favor, ingresa tu correo electrónico.';
      }
      if (!validateEmail(value)) {
        return 'Ingresa un correo electrónico con formato válido (ej. piloto@aerolinea.com).';
      }
    }
    return undefined;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setGeneralError(null);

    if (touched[name as keyof TouchedState]) {
      const err = validateField(name as 'name' | 'email', value);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleFocus = (field: keyof FocusedState) => {
    setFocused((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof FocusedState) => {
    setFocused((prev) => ({ ...prev, [field]: false }));
    if (field === 'name' || field === 'email') {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const err = validateField(field, formData[field]);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);

    setTouched({ name: true, email: true });

    if (nameErr || emailErr) {
      setErrors({ name: nameErr, email: emailErr });
      setGeneralError('Por favor revisa los campos señalados antes de continuar.');
      return;
    }

    setErrors({});
    setGeneralError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const assignedQueue = 1240 + Math.floor(Math.random() * 85);
      setQueueNumber(assignedQueue);
      setIsSubmitting(false);
      setIsSubmitted(true);

      try {
        localStorage.setItem(
          'aris_registered',
          JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            airline: formData.airline.trim() || 'General',
            queue: assignedQueue,
            date: new Date().toISOString(),
          })
        );
      } catch (_) {}
    }, 600);
  };

  const handleReset = () => {
    setFormData({ name: '', email: '', airline: '' });
    setFocused({ name: false, email: false, airline: false });
    setTouched({ name: false, email: false });
    setErrors({});
    setGeneralError(null);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="waitlist-success-box is-visible" aria-live="polite">
        <div className="success-icon-wrap">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '6px' }}>
          ¡Registro completado!
        </h3>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-text)' }}>
          Tu solicitud ha sido agregada a la lista de espera operacional de Aris.
        </p>

        <div
          style={{
            background: 'var(--color-surface-subtle)',
            padding: '18px',
            borderRadius: '12px',
            margin: '20px 0',
            border: '1px solid var(--color-gray-border)',
          }}
        >
          <div
            style={{
              fontSize: '0.8rem',
              color: 'var(--color-gray-muted)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            Posición asignada en beta
          </div>
          <div className="success-queue-number">#{queueNumber.toLocaleString('es-ES')}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)' }}>
            Confirmación enviada a{' '}
            <strong style={{ color: 'var(--color-black)' }}>{formData.email}</strong>
          </div>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-muted)', marginBottom: '18px' }}>
          Te notificaremos con las instrucciones para instalar el perfil de prueba en tu dispositivo
          cuando comiencen los vuelos de evaluación.
        </p>

        <button
          type="button"
          onClick={handleReset}
          className="btn-pill-secondary"
          style={{ fontSize: '0.88rem', padding: '8px 20px' }}
        >
          Registrar otro tripulante
        </button>
      </div>
    );
  }

  const isNameActive = focused.name || Boolean(formData.name);
  const isEmailActive = focused.email || Boolean(formData.email);
  const isAirlineActive = focused.airline || Boolean(formData.airline);

  return (
    <form id="waitlistForm" onSubmit={handleSubmit} noValidate>
      {generalError && (
        <div
          role="alert"
          style={{
            padding: '10px 14px',
            marginBottom: '16px',
            borderRadius: '8px',
            backgroundColor: 'rgba(244, 67, 54, 0.08)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            color: '#d32f2f',
            fontSize: '0.88rem',
            fontWeight: 500,
          }}
        >
          {generalError}
        </div>
      )}

      <div className="input-field">
        <input
          id="pilot_name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          onFocus={() => handleFocus('name')}
          onBlur={() => handleBlur('name')}
          className={`validate ${errors.name ? 'invalid' : touched.name && formData.name ? 'valid' : ''}`}
          autoComplete="name"
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
        />
        <label htmlFor="pilot_name" className={isNameActive ? 'active' : ''}>
          Nombre completo
        </label>
        <span
          className={`helper-text ${errors.name ? 'red-text' : ''}`}
          data-error={errors.name}
        >
          {errors.name || 'Tu nombre y apellidos como tripulante'}
        </span>
      </div>

      <div className="input-field">
        <input
          id="pilot_email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          onFocus={() => handleFocus('email')}
          onBlur={() => handleBlur('email')}
          className={`validate ${errors.email ? 'invalid' : touched.email && formData.email ? 'valid' : ''}`}
          autoComplete="email"
          aria-required="true"
          aria-invalid={Boolean(errors.email)}
        />
        <label htmlFor="pilot_email" className={isEmailActive ? 'active' : ''}>
          Correo electrónico
        </label>
        <span
          className={`helper-text ${errors.email ? 'red-text' : ''}`}
          data-error={errors.email}
        >
          {errors.email || 'Preferiblemente correo corporativo o de vuelo'}
        </span>
      </div>

      <div className="input-field">
        <input
          id="pilot_airline"
          name="airline"
          type="text"
          value={formData.airline}
          onChange={handleChange}
          onFocus={() => handleFocus('airline')}
          onBlur={() => handleBlur('airline')}
          autoComplete="organization"
        />
        <label htmlFor="pilot_airline" className={isAirlineActive ? 'active' : ''}>
          Aerolínea u operador (opcional)
        </label>
        <span className="helper-text">
          Ejemplo: Iberia, Air Europa, Avianca, Vueling, Aviación Ejecutiva
        </span>
      </div>

      <button
        type="submit"
        id="waitlistSubmitBtn"
        className="btn waves-effect waves-light btn-pill-primary waitlist-submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Verificando con operaciones...' : 'Unirme a la lista de espera'}
      </button>

      <p className="waitlist-privacy-notice">
        Sin spam. Solo recibirás el enlace prioritario de descarga en TestFlight / Google Play Beta
        cuando tu turno esté activo.
      </p>
    </form>
  );
}
