CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data ->> 'username');
  RETURN new;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: cookies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cookies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    description text NOT NULL,
    source text NOT NULL,
    earned_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: habit_completions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habit_completions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    habit_id uuid NOT NULL,
    user_id uuid NOT NULL,
    completed_date date NOT NULL,
    cookie_awarded boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: habits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.habits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: journal_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.journal_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    entry text NOT NULL,
    prompt text,
    mood text,
    cookies_earned integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: mood_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.mood_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    date date NOT NULL,
    mood text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    username text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: tiny_steps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tiny_steps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    text text NOT NULL,
    date date NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: cookies cookies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cookies
    ADD CONSTRAINT cookies_pkey PRIMARY KEY (id);


--
-- Name: habit_completions habit_completions_habit_id_completed_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_completions
    ADD CONSTRAINT habit_completions_habit_id_completed_date_key UNIQUE (habit_id, completed_date);


--
-- Name: habit_completions habit_completions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_completions
    ADD CONSTRAINT habit_completions_pkey PRIMARY KEY (id);


--
-- Name: habits habits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT habits_pkey PRIMARY KEY (id);


--
-- Name: journal_entries journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_pkey PRIMARY KEY (id);


--
-- Name: journal_entries journal_entries_user_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_user_id_date_key UNIQUE (user_id, date);


--
-- Name: mood_entries mood_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mood_entries
    ADD CONSTRAINT mood_entries_pkey PRIMARY KEY (id);


--
-- Name: mood_entries mood_entries_user_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mood_entries
    ADD CONSTRAINT mood_entries_user_id_date_key UNIQUE (user_id, date);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: tiny_steps tiny_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tiny_steps
    ADD CONSTRAINT tiny_steps_pkey PRIMARY KEY (id);


--
-- Name: idx_cookies_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cookies_user ON public.cookies USING btree (user_id);


--
-- Name: idx_habit_completions_habit; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_habit_completions_habit ON public.habit_completions USING btree (habit_id);


--
-- Name: idx_habit_completions_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_habit_completions_user_date ON public.habit_completions USING btree (user_id, completed_date);


--
-- Name: idx_habits_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_habits_user ON public.habits USING btree (user_id);


--
-- Name: idx_journal_entries_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_journal_entries_user_date ON public.journal_entries USING btree (user_id, date);


--
-- Name: idx_mood_entries_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_mood_entries_user_date ON public.mood_entries USING btree (user_id, date);


--
-- Name: idx_tiny_steps_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_tiny_steps_user_date ON public.tiny_steps USING btree (user_id, date);


--
-- Name: journal_entries update_journal_entries_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_journal_entries_updated_at BEFORE UPDATE ON public.journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: cookies cookies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cookies
    ADD CONSTRAINT cookies_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: habit_completions habit_completions_habit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_completions
    ADD CONSTRAINT habit_completions_habit_id_fkey FOREIGN KEY (habit_id) REFERENCES public.habits(id) ON DELETE CASCADE;


--
-- Name: habit_completions habit_completions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habit_completions
    ADD CONSTRAINT habit_completions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: habits habits_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.habits
    ADD CONSTRAINT habits_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: journal_entries journal_entries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.journal_entries
    ADD CONSTRAINT journal_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mood_entries mood_entries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.mood_entries
    ADD CONSTRAINT mood_entries_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: tiny_steps tiny_steps_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tiny_steps
    ADD CONSTRAINT tiny_steps_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: cookies Users can create their own cookies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own cookies" ON public.cookies FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: habit_completions Users can create their own habit completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own habit completions" ON public.habit_completions FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: habits Users can create their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own habits" ON public.habits FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: journal_entries Users can create their own journal entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own journal entries" ON public.journal_entries FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: mood_entries Users can create their own mood entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own mood entries" ON public.mood_entries FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: tiny_steps Users can create their own tiny steps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create their own tiny steps" ON public.tiny_steps FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: cookies Users can delete their own cookies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own cookies" ON public.cookies FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: habit_completions Users can delete their own habit completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own habit completions" ON public.habit_completions FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: habits Users can delete their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own habits" ON public.habits FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: journal_entries Users can delete their own journal entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own journal entries" ON public.journal_entries FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: mood_entries Users can delete their own mood entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own mood entries" ON public.mood_entries FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: tiny_steps Users can delete their own tiny steps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own tiny steps" ON public.tiny_steps FOR DELETE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can insert their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK ((auth.uid() = id));


--
-- Name: habit_completions Users can update their own habit completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own habit completions" ON public.habit_completions FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: habits Users can update their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own habits" ON public.habits FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: journal_entries Users can update their own journal entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own journal entries" ON public.journal_entries FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: mood_entries Users can update their own mood entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own mood entries" ON public.mood_entries FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id));


--
-- Name: tiny_steps Users can update their own tiny steps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own tiny steps" ON public.tiny_steps FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: cookies Users can view their own cookies; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own cookies" ON public.cookies FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: habit_completions Users can view their own habit completions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own habit completions" ON public.habit_completions FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: habits Users can view their own habits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own habits" ON public.habits FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: journal_entries Users can view their own journal entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own journal entries" ON public.journal_entries FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: mood_entries Users can view their own mood entries; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own mood entries" ON public.mood_entries FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: tiny_steps Users can view their own tiny steps; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own tiny steps" ON public.tiny_steps FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: cookies; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.cookies ENABLE ROW LEVEL SECURITY;

--
-- Name: habit_completions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;

--
-- Name: habits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

--
-- Name: journal_entries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: mood_entries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: tiny_steps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.tiny_steps ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;